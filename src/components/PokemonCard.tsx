import { Pokemon } from '@/types/pokemon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: (pokemon: Pokemon) => void;
}

export const PokemonCard = ({ pokemon, onClick }: PokemonCardProps) => {
  const primaryType = pokemon.types[0]?.type.name || 'normal';
  
  return (
    <Card 
      className="pokemon-card group relative overflow-hidden"
      onClick={() => onClick(pokemon)}
    >
      {/* Background Gradient based on primary type */}
      <div 
        className={`absolute inset-0 opacity-10 type-${primaryType}`}
        style={{ 
          background: `linear-gradient(135deg, var(--type-${primaryType}), transparent)` 
        }}
      />
      
      {/* Pokemon ID */}
      <div className="absolute top-2 right-2 text-xs font-mono text-muted-foreground">
        #{pokemon.id.toString().padStart(3, '0')}
      </div>

      {/* Pokemon Image */}
      <div className="flex justify-center pt-6 pb-4">
        <div className="relative">
          <img
            src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
            onError={(e) => {
              e.currentTarget.src = pokemon.sprites.front_default;
            }}
          />
          
          {/* Glow effect on hover */}
          <div 
            className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl type-${primaryType}`}
            style={{ background: `var(--type-${primaryType})` }}
          />
        </div>
      </div>

      {/* Pokemon Name */}
      <div className="px-4 pb-4">
        <h3 className="text-lg font-semibold capitalize text-center mb-3 text-foreground">
          {pokemon.name.replace('-', ' ')}
        </h3>

        {/* Pokemon Types */}
        <div className="flex gap-1 justify-center flex-wrap">
          {pokemon.types.map((typeInfo) => (
            <Badge
              key={typeInfo.type.name}
              className={`type-badge type-${typeInfo.type.name} text-white border-0`}
              variant="secondary"
            >
              {typeInfo.type.name}
            </Badge>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="text-center">
              <div className="font-medium">Height</div>
              <div>{(pokemon.height / 10).toFixed(1)}m</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Weight</div>
              <div>{(pokemon.weight / 10).toFixed(1)}kg</div>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="text-center">
              <div className="font-medium">Base XP</div>
              <div>{pokemon.base_experience || 'N/A'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Generation</div>
              <div className="capitalize">{pokemon.generation || 'I'}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};