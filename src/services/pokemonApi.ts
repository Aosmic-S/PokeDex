import { Pokemon, PokemonListResponse, PokemonSpecies, EvolutionChain, Move } from '@/types/pokemon';
import localForage from 'localforage';

const BASE_URL = 'https://pokeapi.co/api/v2';

class PokemonAPI {
  private cache = new Map<string, any>();

  constructor() {
    // Initialize localForage for persistent caching
    localForage.config({
      name: 'PokedexCache',
      storeName: 'pokemon_data',
      description: 'Cached Pokemon data for offline access'
    });
  }

  private async fetchWithCache<T>(url: string): Promise<T> {
    // Check memory cache first
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    // Check persistent cache
    try {
      const cached = await localForage.getItem<T>(url);
      if (cached) {
        this.cache.set(url, cached);
        return cached;
      }
    } catch (error) {
      console.warn('Failed to read from persistent cache:', error);
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Store in both caches
      this.cache.set(url, data);
      try {
        await localForage.setItem(url, data);
      } catch (error) {
        console.warn('Failed to write to persistent cache:', error);
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  async getPokemonList(limit: number = 1025, offset: number = 0): Promise<PokemonListResponse> {
    return this.fetchWithCache(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  }

  async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    return this.fetchWithCache(`${BASE_URL}/pokemon/${nameOrId}`);
  }

  async getPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
    return this.fetchWithCache(`${BASE_URL}/pokemon-species/${nameOrId}`);
  }

  async getEvolutionChain(id: number): Promise<EvolutionChain> {
    return this.fetchWithCache(`${BASE_URL}/evolution-chain/${id}`);
  }

  async getMove(nameOrId: string | number): Promise<Move> {
    return this.fetchWithCache(`${BASE_URL}/move/${nameOrId}`);
  }

  async getEvolutionChainFromUrl(url: string): Promise<EvolutionChain> {
    return this.fetchWithCache(url);
  }

  async searchPokemon(query: string): Promise<Pokemon[]> {
    const { results } = await this.getPokemonList(1025);
    const filtered = results.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    
    const promises = filtered.slice(0, 20).map(pokemon => 
      this.getPokemon(pokemon.name)
    );
    
    return Promise.all(promises);
  }

  // Advanced filtering methods
  async filterPokemonByType(type: string, generation?: number): Promise<Pokemon[]> {
    const limit = generation ? 151 : 1025; // Adjust based on generation
    const { results } = await this.getPokemonList(limit);
    
    const pokemonPromises = results.map(async (item) => {
      try {
        return await this.getPokemon(item.name);
      } catch {
        return null;
      }
    });

    const pokemonList = await Promise.all(pokemonPromises);
    return pokemonList
      .filter((p): p is Pokemon => p !== null)
      .filter(p => type === 'all' || p.types.some(t => t.type.name === type));
  }

  async filterPokemonByStats(minTotal: number = 0, maxTotal: number = 1000): Promise<Pokemon[]> {
    const { results } = await this.getPokemonList(1025);
    
    const pokemonPromises = results.map(async (item) => {
      try {
        return await this.getPokemon(item.name);
      } catch {
        return null;
      }
    });

    const pokemonList = await Promise.all(pokemonPromises);
    return pokemonList
      .filter((p): p is Pokemon => p !== null)
      .filter(p => {
        const total = p.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
        return total >= minTotal && total <= maxTotal;
      });
  }

  getTypeColor(type: string): string {
    const typeColors: Record<string, string> = {
      normal: 'hsl(var(--type-normal))',
      fire: 'hsl(var(--type-fire))',
      water: 'hsl(var(--type-water))',
      electric: 'hsl(var(--type-electric))',
      grass: 'hsl(var(--type-grass))',
      ice: 'hsl(var(--type-ice))',
      fighting: 'hsl(var(--type-fighting))',
      poison: 'hsl(var(--type-poison))',
      ground: 'hsl(var(--type-ground))',
      flying: 'hsl(var(--type-flying))',
      psychic: 'hsl(var(--type-psychic))',
      bug: 'hsl(var(--type-bug))',
      rock: 'hsl(var(--type-rock))',
      ghost: 'hsl(var(--type-ghost))',
      dragon: 'hsl(var(--type-dragon))',
      dark: 'hsl(var(--type-dark))',
      steel: 'hsl(var(--type-steel))',
      fairy: 'hsl(var(--type-fairy))',
    };
    
    return typeColors[type] || typeColors.normal;
  }
}

export const pokemonApi = new PokemonAPI();