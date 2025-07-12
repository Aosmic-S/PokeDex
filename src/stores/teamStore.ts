import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pokemon } from '@/types/pokemon';

export interface Team {
  id: string;
  name: string;
  pokemon: (Pokemon | null)[];
  createdAt: Date;
  updatedAt: Date;
}

interface TeamStore {
  teams: Team[];
  currentTeam: Team | null;
  createTeam: (name: string) => void;
  deleteTeam: (id: string) => void;
  setCurrentTeam: (id: string) => void;
  addPokemonToTeam: (pokemon: Pokemon, slot: number) => void;
  removePokemonFromTeam: (slot: number) => void;
  exportTeam: (id: string) => string;
  importTeam: (qrData: string) => void;
}

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      teams: [],
      currentTeam: null,
      
      createTeam: (name: string) => {
        const newTeam: Team = {
          id: crypto.randomUUID(),
          name,
          pokemon: [null, null, null, null, null, null],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          teams: [...state.teams, newTeam],
          currentTeam: newTeam,
        }));
      },
      
      deleteTeam: (id: string) => {
        set((state) => ({
          teams: state.teams.filter(team => team.id !== id),
          currentTeam: state.currentTeam?.id === id ? null : state.currentTeam,
        }));
      },
      
      setCurrentTeam: (id: string) => {
        const team = get().teams.find(t => t.id === id);
        if (team) {
          set({ currentTeam: team });
        }
      },
      
      addPokemonToTeam: (pokemon: Pokemon, slot: number) => {
        const { currentTeam } = get();
        if (!currentTeam || slot < 0 || slot > 5) return;
        
        const updatedPokemon = [...currentTeam.pokemon];
        updatedPokemon[slot] = pokemon;
        
        const updatedTeam = {
          ...currentTeam,
          pokemon: updatedPokemon,
          updatedAt: new Date(),
        };
        
        set((state) => ({
          teams: state.teams.map(team => 
            team.id === currentTeam.id ? updatedTeam : team
          ),
          currentTeam: updatedTeam,
        }));
      },
      
      removePokemonFromTeam: (slot: number) => {
        const { currentTeam } = get();
        if (!currentTeam || slot < 0 || slot > 5) return;
        
        const updatedPokemon = [...currentTeam.pokemon];
        updatedPokemon[slot] = null;
        
        const updatedTeam = {
          ...currentTeam,
          pokemon: updatedPokemon,
          updatedAt: new Date(),
        };
        
        set((state) => ({
          teams: state.teams.map(team => 
            team.id === currentTeam.id ? updatedTeam : team
          ),
          currentTeam: updatedTeam,
        }));
      },
      
      exportTeam: (id: string) => {
        const team = get().teams.find(t => t.id === id);
        if (!team) return '';
        
        const exportData = {
          name: team.name,
          pokemon: team.pokemon.map(p => p ? { id: p.id, name: p.name } : null),
        };
        
        return btoa(JSON.stringify(exportData));
      },
      
      importTeam: (qrData: string) => {
        try {
          const data = JSON.parse(atob(qrData));
          const newTeam: Team = {
            id: crypto.randomUUID(),
            name: `${data.name} (Imported)`,
            pokemon: data.pokemon,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          set((state) => ({
            teams: [...state.teams, newTeam],
          }));
        } catch (error) {
          console.error('Failed to import team:', error);
        }
      },
    }),
    {
      name: 'pokedex-teams',
    }
  )
);