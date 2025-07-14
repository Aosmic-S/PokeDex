import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pokemon } from '@/types/pokemon';
import { useTeamStore, Team } from '@/stores/teamStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Plus,
  Trash2,
  Download,
  Upload,
  X,
  Star,
  Sword,
  Shield as ShieldIcon,
  Zap
} from 'lucide-react';

interface TeamBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  availablePokemon: Pokemon[];
  onSelectPokemon: (pokemon: Pokemon) => void;
}

export const TeamBuilder = ({ isOpen, onClose, availablePokemon, onSelectPokemon }: TeamBuilderProps) => {
  const { 
    teams, 
    currentTeam, 
    createTeam, 
    deleteTeam, 
    setCurrentTeam, 
    addPokemonToTeam,
    removePokemonFromTeam,
    exportTeam,
    importTeam 
  } = useTeamStore();
  
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showPokemonSelector, setShowPokemonSelector] = useState(false);
  const { toast } = useToast();

  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      createTeam(newTeamName.trim());
      setNewTeamName('');
      toast({
        title: "Team Created!",
        description: `${newTeamName} has been created successfully.`,
      });
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    deleteTeam(teamId);
    toast({
      title: "Team Deleted",
      description: "Team has been removed.",
      variant: "destructive",
    });
  };

  const handleAddPokemon = (pokemon: Pokemon) => {
    if (selectedSlot !== null && currentTeam) {
      addPokemonToTeam(pokemon, selectedSlot);
      setShowPokemonSelector(false);
      setSelectedSlot(null);
      toast({
        title: "Pokemon Added!",
        description: `${pokemon.name} has been added to your team.`,
      });
    }
  };

  const handleExportTeam = (teamId: string) => {
    const exportData = exportTeam(teamId);
    navigator.clipboard.writeText(exportData);
    toast({
      title: "Team Exported!",
      description: "Team data copied to clipboard.",
    });
  };

  const getTypeColor = (type: string) => {
    return `hsl(var(--type-${type}))`;
  };

  const calculateTeamStats = (team: Team) => {
    const pokemonInTeam = team.pokemon.filter(p => p !== null) as Pokemon[];
    if (pokemonInTeam.length === 0) return { totalHP: 0, totalAttack: 0, totalDefense: 0, totalSpeed: 0 };

    const stats = pokemonInTeam.reduce((acc, pokemon) => {
      const hp = pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 0;
      const attack = pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
      const defense = pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0;
      const speed = pokemon.stats.find(s => s.stat.name === 'speed')?.base_stat || 0;

      return {
        totalHP: acc.totalHP + hp,
        totalAttack: acc.totalAttack + attack,
        totalDefense: acc.totalDefense + defense,
        totalSpeed: acc.totalSpeed + speed,
      };
    }, { totalHP: 0, totalAttack: 0, totalDefense: 0, totalSpeed: 0 });

    return stats;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card border border-border rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Team Builder</h2>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6">
          {/* Create New Team */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter team name..."
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateTeam()}
                />
                <Button onClick={handleCreateTeam} disabled={!newTeamName.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {teams.map((team) => {
              const teamStats = calculateTeamStats(team);
              const isActive = currentTeam?.id === team.id;
              
              return (
                <Card key={team.id} className={`${isActive ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {team.name}
                        {isActive && <Badge variant="default">Active</Badge>}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentTeam(team.id)}
                          disabled={isActive}
                        >
                          Select
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportTeam(team.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteTeam(team.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Pokemon Slots */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {team.pokemon.map((pokemon, index) => (
                        <div
                          key={index}
                          className={`aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors ${
                            pokemon ? 'bg-card' : 'bg-muted/20'
                          }`}
                          onClick={() => {
                            if (isActive) {
                              if (pokemon) {
                                removePokemonFromTeam(index);
                              } else {
                                setSelectedSlot(index);
                                setShowPokemonSelector(true);
                              }
                            }
                          }}
                        >
                          {pokemon ? (
                            <div className="text-center p-2">
                              <img
                                src={pokemon.sprites.front_default}
                                alt={pokemon.name}
                                className="w-12 h-12 mx-auto mb-1"
                              />
                              <div className="text-xs font-medium capitalize truncate">
                                {pokemon.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Lv. {pokemon.base_experience ? Math.floor(pokemon.base_experience / 10) : 1}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Plus className="h-8 w-8 text-muted-foreground mb-1" />
                              <div className="text-xs text-muted-foreground">Add Pokemon</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Team Stats */}
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <Star className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
                        <div className="font-medium">HP</div>
                        <div>{teamStats.totalHP}</div>
                      </div>
                      <div className="text-center">
                        <Sword className="h-4 w-4 mx-auto mb-1 text-red-500" />
                        <div className="font-medium">ATK</div>
                        <div>{teamStats.totalAttack}</div>
                      </div>
                      <div className="text-center">
                        <ShieldIcon className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                        <div className="font-medium">DEF</div>
                        <div>{teamStats.totalDefense}</div>
                      </div>
                      <div className="text-center">
                        <Zap className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
                        <div className="font-medium">SPD</div>
                        <div>{teamStats.totalSpeed}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Pokemon Selector Modal */}
        <AnimatePresence>
          {showPokemonSelector && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowPokemonSelector(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Select Pokemon</h3>
                    <Button variant="ghost" onClick={() => setShowPokemonSelector(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-y-auto max-h-[60vh] p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {availablePokemon.slice(0, 150).map((pokemon) => (
                      <Card
                        key={pokemon.id}
                        className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                        onClick={() => handleAddPokemon(pokemon)}
                      >
                        <CardContent className="p-3 text-center">
                          <img
                            src={pokemon.sprites.front_default}
                            alt={pokemon.name}
                            className="w-16 h-16 mx-auto mb-2"
                          />
                          <div className="text-sm font-medium capitalize truncate">
                            {pokemon.name}
                          </div>
                          <div className="flex gap-1 justify-center mt-1">
                            {pokemon.types.slice(0, 2).map((typeInfo) => (
                              <Badge
                                key={typeInfo.type.name}
                                className="text-xs"
                                style={{ backgroundColor: getTypeColor(typeInfo.type.name) }}
                              >
                                {typeInfo.type.name}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};