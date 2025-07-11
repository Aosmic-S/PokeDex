import { useState, useEffect } from 'react';
import { Move, PokemonMove } from '@/types/pokemon';
import { pokemonApi } from '@/services/pokemonApi';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Zap, Shield, Sword, Star } from 'lucide-react';

interface MovesListProps {
  moves: PokemonMove[];
}

interface ProcessedMove {
  name: string;
  level: number;
  method: string;
  power?: number;
  accuracy?: number;
  pp?: number;
  type?: string;
  damageClass?: string;
  description?: string;
}

export const MovesList = ({ moves }: MovesListProps) => {
  const [processedMoves, setProcessedMoves] = useState<ProcessedMove[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('all');

  useEffect(() => {
    processMoves();
  }, [moves]);

  const processMoves = async () => {
    try {
      setLoading(true);
      
      // Get the latest version group details for each move
      const movePromises = moves.slice(0, 50).map(async (moveData) => {
        try {
          const latestVersion = moveData.version_group_details[moveData.version_group_details.length - 1];
          const moveDetails = await pokemonApi.getMove(moveData.move.name);
          
          return {
            name: moveData.move.name.replace('-', ' '),
            level: latestVersion.level_learned_at,
            method: latestVersion.move_learn_method.name.replace('-', ' '),
            power: moveDetails.power,
            accuracy: moveDetails.accuracy,
            pp: moveDetails.pp,
            type: moveDetails.type.name,
            damageClass: moveDetails.damage_class.name,
            description: moveDetails.flavor_text_entries
              ?.find(entry => entry.language.name === 'en')
              ?.flavor_text.replace(/\f/g, ' ') || 'No description available'
          };
        } catch (error) {
          return {
            name: moveData.move.name.replace('-', ' '),
            level: moveData.version_group_details[0]?.level_learned_at || 0,
            method: moveData.version_group_details[0]?.move_learn_method.name.replace('-', ' ') || 'unknown',
          };
        }
      });

      const processed = await Promise.all(movePromises);
      setProcessedMoves(processed.sort((a, b) => {
        if (a.method !== b.method) {
          const methodOrder = ['level up', 'machine', 'tutor', 'egg'];
          return methodOrder.indexOf(a.method) - methodOrder.indexOf(b.method);
        }
        return a.level - b.level;
      }));
    } catch (error) {
      console.error('Error processing moves:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMoves = processedMoves.filter(move => {
    const matchesSearch = move.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = selectedMethod === 'all' || move.method === selectedMethod;
    return matchesSearch && matchesMethod;
  });

  const movesByMethod = {
    'level up': filteredMoves.filter(m => m.method === 'level up'),
    'machine': filteredMoves.filter(m => m.method === 'machine'),
    'tutor': filteredMoves.filter(m => m.method === 'tutor'),
    'egg': filteredMoves.filter(m => m.method === 'egg'),
  };

  const getMoveIcon = (damageClass?: string) => {
    switch (damageClass) {
      case 'physical': return <Sword className="h-4 w-4" />;
      case 'special': return <Zap className="h-4 w-4" />;
      case 'status': return <Shield className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getPowerDisplay = (power?: number, damageClass?: string) => {
    if (damageClass === 'status') return '—';
    return power || '—';
  };

  if (loading) {
    return (
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Moves</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Loading moves...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Moves ({processedMoves.length})</h3>
      
      {/* Search and Filter */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search moves..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="all">All Methods</option>
          <option value="level up">Level Up</option>
          <option value="machine">TM/TR</option>
          <option value="tutor">Move Tutor</option>
          <option value="egg">Egg Move</option>
        </select>
      </div>

      <Tabs defaultValue="level up" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="level up">Level ({movesByMethod['level up'].length})</TabsTrigger>
          <TabsTrigger value="machine">TM ({movesByMethod['machine'].length})</TabsTrigger>
          <TabsTrigger value="tutor">Tutor ({movesByMethod['tutor'].length})</TabsTrigger>
          <TabsTrigger value="egg">Egg ({movesByMethod['egg'].length})</TabsTrigger>
        </TabsList>

        {Object.entries(movesByMethod).map(([method, moves]) => (
          <TabsContent key={method} value={method} className="space-y-2 max-h-96 overflow-y-auto">
            {moves.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No moves found for this method
              </p>
            ) : (
              moves.map((move, index) => (
                <div
                  key={`${move.name}-${index}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getMoveIcon(move.damageClass)}
                      <span className="font-medium capitalize">{move.name}</span>
                      {move.type && (
                        <Badge className={`type-badge type-${move.type} text-white border-0 text-xs`}>
                          {move.type}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {move.description && move.description.length > 100 
                        ? `${move.description.substring(0, 100)}...`
                        : move.description
                      }
                    </div>
                  </div>

                  <div className="text-right text-sm space-y-1">
                    {method === 'level up' && move.level > 0 && (
                      <div className="text-xs text-muted-foreground">Lv. {move.level}</div>
                    )}
                    
                    <div className="flex gap-3 text-xs">
                      <span>PWR: {getPowerDisplay(move.power, move.damageClass)}</span>
                      <span>ACC: {move.accuracy || '—'}</span>
                      <span>PP: {move.pp || '—'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};