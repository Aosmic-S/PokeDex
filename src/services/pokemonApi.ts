import { Pokemon, PokemonListResponse, PokemonSpecies } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

class PokemonAPI {
  private cache = new Map<string, any>();

  private async fetchWithCache<T>(url: string): Promise<T> {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.cache.set(url, data);
      return data;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  async getPokemonList(limit: number = 151, offset: number = 0): Promise<PokemonListResponse> {
    return this.fetchWithCache(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  }

  async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    return this.fetchWithCache(`${BASE_URL}/pokemon/${nameOrId}`);
  }

  async getPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
    return this.fetchWithCache(`${BASE_URL}/pokemon-species/${nameOrId}`);
  }

  async searchPokemon(query: string): Promise<Pokemon[]> {
    const { results } = await this.getPokemonList(1000);
    const filtered = results.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    
    const promises = filtered.slice(0, 20).map(pokemon => 
      this.getPokemon(pokemon.name)
    );
    
    return Promise.all(promises);
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