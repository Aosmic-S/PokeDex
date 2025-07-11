import { useState, useEffect } from 'react';
import { EvolutionChain, EvolutionChainLink, Pokemon } from '@/types/pokemon';
import { pokemonApi } from '@/services/pokemonApi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Heart, Crown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface EvolutionChainViewProps {
  evolutionChainUrl: string;
  onPokemonClick: (pokemon: Pokemon) => void;
}

interface EvolutionStage {
  pokemon: Pokemon | null;
  name: string;
  evolutionDetails: string[];
}

export const EvolutionChainView = ({ evolutionChainUrl, onPokemonClick }: EvolutionChainViewProps) => {
  const [evolutionStages, setEvolutionStages] = useState<EvolutionStage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvolutionChain();
  }, [evolutionChainUrl]);

  const loadEvolutionChain = async () => {
    try {
      setLoading(true);
      const chainData = await pokemonApi.getEvolutionChainFromUrl(evolutionChainUrl);
      const stages = await processEvolutionChain(chainData.chain);
      setEvolutionStages(stages);
    } catch (error) {
      console.error('Error loading evolution chain:', error);
    } finally {
      setLoading(false);
    }
  };

  const processEvolutionChain = async (chain: EvolutionChainLink): Promise<EvolutionStage[]> => {
    const stages: EvolutionStage[] = [];
    
    const processStage = async (link: EvolutionChainLink) => {
      try {
        const pokemon = await pokemonApi.getPokemon(link.species.name);
        const evolutionDetails = link.evolution_details.map(detail => {
          const conditions: string[] = [];
          
          if (detail.min_level) conditions.push(`Level ${detail.min_level}`);
          if (detail.item) conditions.push(`Use ${detail.item.name.replace('-', ' ')}`);
          if (detail.trigger.name === 'trade') conditions.push('Trade');
          if (detail.min_happiness) conditions.push(`Friendship ${detail.min_happiness}`);
          if (detail.time_of_day) conditions.push(`${detail.time_of_day} time`);
          if (detail.known_move) conditions.push(`Know ${detail.known_move.name.replace('-', ' ')}`);
          
          return conditions.length > 0 ? conditions.join(', ') : 'Special conditions';
        });

        stages.push({
          pokemon,
          name: link.species.name,
          evolutionDetails
        });
      } catch (error) {
        stages.push({
          pokemon: null,
          name: link.species.name,
          evolutionDetails: []
        });
      }

      // Process next evolutions
      for (const evolution of link.evolves_to) {
        await processStage(evolution);
      }
    };

    await processStage(chain);
    return stages;
  };

  const getEvolutionIcon = (details: string[]) => {
    const detail = details[0]?.toLowerCase() || '';
    if (detail.includes('level')) return <Crown className="h-4 w-4" />;
    if (detail.includes('trade')) return <ArrowRight className="h-4 w-4" />;
    if (detail.includes('friendship')) return <Heart className="h-4 w-4" />;
    if (detail.includes('stone') || detail.includes('use')) return <Zap className="h-4 w-4" />;
    return <ArrowRight className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Evolution Chain</h3>
        <div className="flex gap-4 items-center overflow-x-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="text-center min-w-[120px]">
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
              {i < 3 && <ArrowRight className="h-6 w-6 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (evolutionStages.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Evolution Chain</h3>
        <p className="text-muted-foreground">No evolution data available</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Evolution Chain</h3>
      <div className="flex gap-4 items-center overflow-x-auto pb-2">
        {evolutionStages.map((stage, index) => (
          <div key={stage.name} className="flex items-center gap-4">
            <div className="text-center min-w-[120px]">
              {stage.pokemon ? (
                <Button
                  variant="ghost"
                  className="flex flex-col h-auto p-3 hover:bg-accent/50"
                  onClick={() => onPokemonClick(stage.pokemon!)}
                >
                  <img
                    src={stage.pokemon.sprites.other['official-artwork']?.front_default || stage.pokemon.sprites.front_default}
                    alt={stage.pokemon.name}
                    className="w-16 h-16 object-contain mb-2"
                  />
                  <span className="text-sm font-medium capitalize">
                    {stage.pokemon.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    #{stage.pokemon.id.toString().padStart(3, '0')}
                  </span>
                </Button>
              ) : (
                <div className="p-3">
                  <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">?</span>
                  </div>
                  <span className="text-sm capitalize">{stage.name}</span>
                </div>
              )}
            </div>

            {index < evolutionStages.length - 1 && stage.evolutionDetails.length > 0 && (
              <div className="flex flex-col items-center gap-2 min-w-[100px]">
                <div className="flex items-center gap-2 text-primary">
                  {getEvolutionIcon(stage.evolutionDetails)}
                  <ArrowRight className="h-4 w-4" />
                </div>
                <div className="text-center">
                  {stage.evolutionDetails.map((detail, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-xs mb-1 block whitespace-nowrap"
                    >
                      {detail}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};