import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pokemon } from '@/types/pokemon';
import { pokemonApi } from '@/services/pokemonApi';
import { PokemonCard } from './PokemonCard';
import { PokemonDetail } from './PokemonDetail';
import { SearchBar } from './SearchBar';
import { AchievementNotification } from './AchievementNotification';
import { Button } from '@/components/ui/button';
import { Loader2, Zap, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAchievementStore, Achievement } from '@/stores/achievementStore';
import { Link } from 'react-router-dom';

export const Pokedex = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const { toast } = useToast();
  const { incrementStat } = useAchievementStore();

  const POKEMON_PER_PAGE = 20;

  useEffect(() => {
    loadInitialPokemon();
  }, []);

  useEffect(() => {
    filterPokemon();
  }, [pokemon, searchQuery, selectedType]);

  const loadInitialPokemon = async () => {
    try {
      setLoading(true);
      const { results } = await pokemonApi.getPokemonList(151); // First generation
      
      const pokemonPromises = results.map(async (item) => {
        return await pokemonApi.getPokemon(item.name);
      });

      const pokemonData = await Promise.all(pokemonPromises);
      setPokemon(pokemonData);
      
      toast({
        title: "Pokédex Loaded!",
        description: `Successfully loaded ${pokemonData.length} Pokémon`,
      });
    } catch (error) {
      console.error('Error loading Pokemon:', error);
      toast({
        title: "Error",
        description: "Failed to load Pokémon data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPokemon = () => {
    let filtered = pokemon;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toString().includes(searchQuery)
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(p => 
        p.types.some(type => type.type.name === selectedType)
      );
    }

    setFilteredPokemon(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type);
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    incrementStat('pokemonViewed');
  };

  const handleBackToList = () => {
    setSelectedPokemon(null);
  };

  const loadMorePokemon = async () => {
    try {
      const offset = pokemon.length;
      const { results } = await pokemonApi.getPokemonList(50, offset);
      
      const newPokemonPromises = results.map(async (item) => {
        return await pokemonApi.getPokemon(item.name);
      });

      const newPokemonData = await Promise.all(newPokemonPromises);
      setPokemon(prev => [...prev, ...newPokemonData]);
      
      toast({
        title: "More Pokémon Loaded!",
        description: `Added ${newPokemonData.length} more Pokémon`,
      });
    } catch (error) {
      console.error('Error loading more Pokemon:', error);
      toast({
        title: "Error",
        description: "Failed to load more Pokémon.",
        variant: "destructive",
      });
    }
  };

  if (selectedPokemon) {
    return (
      <PokemonDetail 
        pokemon={selectedPokemon} 
        onBack={handleBackToList} 
      />
    );
  }

  const paginatedPokemon = filteredPokemon.slice(0, currentPage * POKEMON_PER_PAGE);
  const hasMore = paginatedPokemon.length < filteredPokemon.length;

  return (
    <div className="min-h-screen bg-background">
      <AchievementNotification 
        achievement={newAchievement} 
        onClose={() => setNewAchievement(null)} 
      />
      
      {/* Header */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="h-8 w-8 text-primary glow" />
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PokédexX
              </h1>
            </div>
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <SearchBar 
            onSearch={handleSearch}
            onTypeFilter={handleTypeFilter}
            selectedType={selectedType}
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="container mx-auto px-4 py-6"
      >
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Loading Pokémon...</p>
          </motion.div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {paginatedPokemon.length} of {filteredPokemon.length} Pokémon
                {searchQuery && ` for "${searchQuery}"`}
                {selectedType !== 'all' && ` with type "${selectedType}"`}
              </p>
            </div>

            {/* Pokemon Grid */}
            {filteredPokemon.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground mb-4">
                  No Pokémon found matching your criteria
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <motion.div 
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  <AnimatePresence>
                    {paginatedPokemon.map((pokemon, index) => (
                      <motion.div
                        key={pokemon.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <PokemonCard 
                          pokemon={pokemon} 
                          onClick={handlePokemonClick}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Load More / Pagination */}
                <div className="flex justify-center">
                  {hasMore && (
                    <Button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      variant="outline"
                      className="transition-smooth hover:glow"
                    >
                      Load More Pokémon
                    </Button>
                  )}
                  
                  {!hasMore && filteredPokemon.length === pokemon.length && (
                    <Button
                      onClick={loadMorePokemon}
                      variant="outline"
                      className="transition-smooth hover:glow"
                    >
                      Load Next Generation
                    </Button>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};