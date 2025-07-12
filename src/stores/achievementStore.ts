import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface AchievementStore {
  achievements: Achievement[];
  stats: {
    pokemonViewed: number;
    evolutionChainsViewed: number;
    encountersDiscovered: number;
    teamsBuilt: number;
    offlineUsage: number;
  };
  unlockAchievement: (id: string) => void;
  incrementStat: (stat: keyof AchievementStore['stats']) => void;
  checkAchievements: () => Achievement[];
}

const initialAchievements: Achievement[] = [
  {
    id: 'first_pokemon',
    title: 'First Discovery',
    description: 'View your first Pokémon',
    icon: '🔍',
    unlocked: false,
  },
  {
    id: 'pokemon_hunter',
    title: 'Pokémon Hunter',
    description: 'View 100 unique Pokémon',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'evolution_master',
    title: 'Evolution Master',
    description: 'View 10 evolution chains',
    icon: '🔄',
    unlocked: false,
  },
  {
    id: 'location_scout',
    title: 'Location Scout',
    description: 'Discover 30+ encounters',
    icon: '🗺️',
    unlocked: false,
  },
  {
    id: 'team_builder',
    title: 'Team Builder',
    description: 'Build your first complete team',
    icon: '👥',
    unlocked: false,
  },
  {
    id: 'offline_explorer',
    title: 'Offline Explorer',
    description: 'Use the app offline',
    icon: '📱',
    unlocked: false,
  },
];

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      achievements: initialAchievements,
      stats: {
        pokemonViewed: 0,
        evolutionChainsViewed: 0,
        encountersDiscovered: 0,
        teamsBuilt: 0,
        offlineUsage: 0,
      },
      
      unlockAchievement: (id: string) => {
        set((state) => ({
          achievements: state.achievements.map((achievement) =>
            achievement.id === id && !achievement.unlocked
              ? { ...achievement, unlocked: true, unlockedAt: new Date() }
              : achievement
          ),
        }));
      },
      
      incrementStat: (stat: keyof AchievementStore['stats']) => {
        set((state) => ({
          stats: {
            ...state.stats,
            [stat]: state.stats[stat] + 1,
          },
        }));
        
        // Check for new achievements
        get().checkAchievements();
      },
      
      checkAchievements: () => {
        const { stats, achievements, unlockAchievement } = get();
        const newlyUnlocked: Achievement[] = [];
        
        // Check each achievement condition
        if (stats.pokemonViewed >= 1 && !achievements.find(a => a.id === 'first_pokemon')?.unlocked) {
          unlockAchievement('first_pokemon');
          newlyUnlocked.push(achievements.find(a => a.id === 'first_pokemon')!);
        }
        
        if (stats.pokemonViewed >= 100 && !achievements.find(a => a.id === 'pokemon_hunter')?.unlocked) {
          unlockAchievement('pokemon_hunter');
          newlyUnlocked.push(achievements.find(a => a.id === 'pokemon_hunter')!);
        }
        
        if (stats.evolutionChainsViewed >= 10 && !achievements.find(a => a.id === 'evolution_master')?.unlocked) {
          unlockAchievement('evolution_master');
          newlyUnlocked.push(achievements.find(a => a.id === 'evolution_master')!);
        }
        
        if (stats.encountersDiscovered >= 30 && !achievements.find(a => a.id === 'location_scout')?.unlocked) {
          unlockAchievement('location_scout');
          newlyUnlocked.push(achievements.find(a => a.id === 'location_scout')!);
        }
        
        if (stats.teamsBuilt >= 1 && !achievements.find(a => a.id === 'team_builder')?.unlocked) {
          unlockAchievement('team_builder');
          newlyUnlocked.push(achievements.find(a => a.id === 'team_builder')!);
        }
        
        if (stats.offlineUsage >= 1 && !achievements.find(a => a.id === 'offline_explorer')?.unlocked) {
          unlockAchievement('offline_explorer');
          newlyUnlocked.push(achievements.find(a => a.id === 'offline_explorer')!);
        }
        
        return newlyUnlocked;
      },
    }),
    {
      name: 'pokedex-achievements',
    }
  )
);