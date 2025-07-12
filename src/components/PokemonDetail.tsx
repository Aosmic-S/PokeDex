import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pokemon, PokemonSpecies } from '@/types/pokemon';
import { pokemonApi } from '@/services/pokemonApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Ruler, Weight, Zap, Heart, Shield, Sword, TrendingUp } from 'lucide-react';
import { StatChart } from '@/components/StatChart';
import { EvolutionChainView } from '@/components/EvolutionChainView';
import { MovesList } from '@/components/MovesList';
import { HolographicDisplay } from '@/components/HolographicDisplay';

interface PokemonDetailProps {
  pokemon: Pokemon;
  onBack: () => void;
}

export const PokemonDetail = ({ pokemon, onBack }: PokemonDetailProps) => {
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const speciesData = await pokemonApi.getPokemonSpecies(pokemon.id);
        setSpecies(speciesData);
      } catch (error) {
        console.error('Error fetching species:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, [pokemon.id]);

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const description = species?.flavor_text_entries
    ?.find(entry => entry.language.name === 'en')
    ?.flavor_text.replace(/\f/g, ' ') || 'No description available.';

  const genus = species?.genera
    ?.find(entry => entry.language.name === 'en')
    ?.genus || 'Unknown Pokémon';

  const getStatIcon = (statName: string) => {
    switch (statName) {
      case 'hp': return <Heart className="h-4 w-4" />;
      case 'attack': return <Sword className="h-4 w-4" />;
      case 'defense': return <Shield className="h-4 w-4" />;
      case 'special-attack': return <Zap className="h-4 w-4" />;
      case 'special-defense': return <Shield className="h-4 w-4" />;
      case 'speed': return <TrendingUp className="h-4 w-4" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const formatStatName = (name: string) => {
    return name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    // This will be handled by the parent component
    console.log('Navigate to:', pokemon.name);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold capitalize">
            {pokemon.name.replace('-', ' ')}
          </h1>
          <p className="text-muted-foreground">#{pokemon.id.toString().padStart(3, '0')} • {genus}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column - Image & Basic Info */}
        <div className="space-y-6">
          {/* Holographic Pokemon Display */}
          <Card className="pokemon-card relative overflow-hidden">
            <div 
              className={`absolute inset-0 opacity-20 type-${primaryType}`}
              style={{ 
                background: `linear-gradient(135deg, var(--type-${primaryType}), transparent)` 
              }}
            />
            <div className="relative p-8">
              <HolographicDisplay 
                pokemon={pokemon} 
                className="w-48 h-48 mx-auto"
              />
            </div>
          </Card>

          {/* Types */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Type</h3>
            <div className="flex gap-2">
              {pokemon.types.map((typeInfo) => (
                <Badge
                  key={typeInfo.type.name}
                  className={`type-badge type-${typeInfo.type.name} text-white border-0 text-sm px-4 py-2`}
                  variant="secondary"
                >
                  {typeInfo.type.name}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Physical Stats */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Physical Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Height</div>
                  <div className="font-medium">{(pokemon.height / 10).toFixed(1)} m</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Weight className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Weight</div>
                  <div className="font-medium">{(pokemon.weight / 10).toFixed(1)} kg</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Description & Radar Chart */}
        <div className="space-y-6">
          {/* Description */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {loading ? 'Loading description...' : description}
            </p>
          </Card>

          {/* Stats Radar Chart */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Base Stats Radar</h3>
            <StatChart 
              stats={pokemon.stats.map(stat => ({
                name: stat.stat.name.replace('-', ' '),
                value: stat.base_stat,
                max: 200
              }))}
            />
            <div className="mt-2 text-center text-sm text-muted-foreground">
              Total: {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
            </div>
          </Card>
        </div>
      </div>

      {/* Detailed Tabs Section */}
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stats">Detailed Stats</TabsTrigger>
          <TabsTrigger value="abilities">Abilities</TabsTrigger>
          <TabsTrigger value="moves">Moves</TabsTrigger>
          <TabsTrigger value="evolution">Evolution</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Base Stats Breakdown</h3>
            <div className="space-y-4">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatIcon(stat.stat.name)}
                      <span className="text-sm font-medium">
                        {formatStatName(stat.stat.name)}
                      </span>
                    </div>
                    <span className="text-sm font-bold">
                      {stat.base_stat}
                    </span>
                  </div>
                  <Progress 
                    value={(stat.base_stat / 200) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
              
              {/* Total Stats */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="abilities" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Abilities</h3>
            <div className="space-y-3">
              {pokemon.abilities.map((abilityInfo, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <div className="font-medium capitalize">
                      {abilityInfo.ability.name.replace('-', ' ')}
                    </div>
                    {abilityInfo.is_hidden && (
                      <div className="text-xs text-muted-foreground">
                        Hidden Ability
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Slot {abilityInfo.slot}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="moves" className="space-y-4">
          <MovesList moves={pokemon.moves} />
        </TabsContent>

        <TabsContent value="evolution" className="space-y-4">
          {species?.evolution_chain?.url ? (
            <EvolutionChainView 
              evolutionChainUrl={species.evolution_chain.url}
              onPokemonClick={handlePokemonClick}
            />
          ) : (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Evolution Chain</h3>
              <p className="text-muted-foreground">
                {loading ? 'Loading evolution data...' : 'No evolution data available'}
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};