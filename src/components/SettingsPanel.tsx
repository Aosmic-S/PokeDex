import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAchievementStore } from '@/stores/achievementStore';
import { useToast } from '@/hooks/use-toast';
import {
  Settings2,
  Volume2,
  VolumeOff,
  Palette,
  Zap,
  Eye,
  Gamepad2,
  Shield,
  Battery,
  Wifi,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Camera,
  Mic,
  Bell,
  Globe,
  Clock,
  Trophy,
  Star,
  Sparkles
} from 'lucide-react';

interface SettingsState {
  // Audio Settings
  soundEnabled: boolean;
  musicVolume: number;
  effectsVolume: number;
  voiceEnabled: boolean;
  
  // Display Settings
  theme: string;
  brightness: number;
  contrast: number;
  animationsEnabled: boolean;
  hologramMode: boolean;
  
  // Gameplay Settings
  autoSave: boolean;
  notifications: boolean;
  vibration: boolean;
  fastMode: boolean;
  
  // Advanced Settings
  cacheEnabled: boolean;
  offlineMode: boolean;
  debugMode: boolean;
  experimentalFeatures: boolean;
  
  // Accessibility
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: number;
}

const themes = [
  { id: 'default', name: 'Classic Dark', color: 'hsl(217 91% 65%)', description: 'Original PokédexX theme' },
  { id: 'light', name: 'Bright Light', color: 'hsl(210 40% 98%)', description: 'Light mode for day use' },
  { id: 'fire', name: 'Fire Red', color: 'hsl(12 76% 61%)', description: 'Inspired by Fire-type Pokémon' },
  { id: 'water', name: 'Ocean Blue', color: 'hsl(211 85% 63%)', description: 'Deep as the ocean depths' },
  { id: 'electric', name: 'Thunder Yellow', color: 'hsl(53 98% 64%)', description: 'Electric-type energy' },
  { id: 'psychic', name: 'Mystic Purple', color: 'hsl(322 88% 67%)', description: 'Psychic powers theme' },
  { id: 'admin', name: 'Pokedex Red', color: 'hsl(0 84% 60%)', description: 'Admin-only classic red Pokédex theme', adminOnly: true }
];

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export const SettingsPanel = ({ isOpen, onClose, isAdmin = false }: SettingsPanelProps) => {
  const [settings, setSettings] = useState<SettingsState>({
    soundEnabled: true,
    musicVolume: 70,
    effectsVolume: 80,
    voiceEnabled: true,
    theme: 'default',
    brightness: 100,
    contrast: 100,
    animationsEnabled: true,
    hologramMode: true,
    autoSave: true,
    notifications: true,
    vibration: true,
    fastMode: false,
    cacheEnabled: true,
    offlineMode: false,
    debugMode: false,
    experimentalFeatures: false,
    highContrast: false,
    reducedMotion: false,
    fontSize: 16
  });

  const { achievements, stats } = useAchievementStore();
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState('default');

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('pokedex-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    const savedTheme = localStorage.getItem('pokedex-theme') || 'default';
    setSelectedTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const saveSettings = (newSettings: Partial<SettingsState>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('pokedex-settings', JSON.stringify(updatedSettings));
    
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  const applyTheme = (themeId: string) => {
    const root = document.documentElement;
    
    switch (themeId) {
      case 'light':
        root.style.setProperty('--background', '0 0% 100%');
        root.style.setProperty('--foreground', '222.2 84% 4.9%');
        root.style.setProperty('--card', '0 0% 100%');
        root.style.setProperty('--primary', '221.2 83.2% 53.3%');
        break;
      case 'fire':
        root.style.setProperty('--background', '12 100% 6%');
        root.style.setProperty('--primary', '12 76% 61%');
        root.style.setProperty('--accent', '25 85% 55%');
        break;
      case 'water':
        root.style.setProperty('--background', '211 100% 8%');
        root.style.setProperty('--primary', '211 85% 63%');
        root.style.setProperty('--accent', '200 85% 55%');
        break;
      case 'electric':
        root.style.setProperty('--background', '53 100% 8%');
        root.style.setProperty('--primary', '53 98% 64%');
        root.style.setProperty('--accent', '48 95% 55%');
        break;
      case 'psychic':
        root.style.setProperty('--background', '322 100% 8%');
        root.style.setProperty('--primary', '322 88% 67%');
        root.style.setProperty('--accent', '310 85% 60%');
        break;
      case 'admin':
        // Special red Pokédex theme
        root.style.setProperty('--background', '0 100% 2%');
        root.style.setProperty('--foreground', '0 100% 95%');
        root.style.setProperty('--primary', '0 84% 60%');
        root.style.setProperty('--accent', '15 90% 55%');
        root.style.setProperty('--card', '0 50% 8%');
        root.style.setProperty('--border', '0 50% 15%');
        break;
      default:
        // Reset to default theme
        root.style.setProperty('--background', '220 13% 8%');
        root.style.setProperty('--foreground', '210 40% 95%');
        root.style.setProperty('--primary', '217 91% 65%');
        root.style.setProperty('--accent', '217 91% 65%');
    }
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    localStorage.setItem('pokedex-theme', themeId);
    applyTheme(themeId);
    
    toast({
      title: "Theme Applied",
      description: `Switched to ${themes.find(t => t.id === themeId)?.name} theme.`,
    });
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);

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
        className="bg-card border border-border rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings2 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Settings & Achievements</h2>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-3 m-4">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="themes">Themes</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="p-6 space-y-6">
              {/* Audio Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Audio Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sound Effects</Label>
                      <p className="text-sm text-muted-foreground">Enable Pokémon sounds</p>
                    </div>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => saveSettings({ soundEnabled: checked })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Music Volume</Label>
                    <Slider
                      value={[settings.musicVolume]}
                      onValueChange={([value]) => saveSettings({ musicVolume: value })}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Effects Volume</Label>
                    <Slider
                      value={[settings.effectsVolume]}
                      onValueChange={([value]) => saveSettings({ effectsVolume: value })}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Voice Announcements</Label>
                      <p className="text-sm text-muted-foreground">Pokédex voice readings</p>
                    </div>
                    <Switch
                      checked={settings.voiceEnabled}
                      onCheckedChange={(checked) => saveSettings({ voiceEnabled: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Display Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Display Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Brightness</Label>
                    <Slider
                      value={[settings.brightness]}
                      onValueChange={([value]) => saveSettings({ brightness: value })}
                      max={150}
                      min={50}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Contrast</Label>
                    <Slider
                      value={[settings.contrast]}
                      onValueChange={([value]) => saveSettings({ contrast: value })}
                      max={150}
                      min={50}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable smooth transitions</p>
                    </div>
                    <Switch
                      checked={settings.animationsEnabled}
                      onCheckedChange={(checked) => saveSettings({ animationsEnabled: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Hologram Mode</Label>
                      <p className="text-sm text-muted-foreground">3D Pokémon display</p>
                    </div>
                    <Switch
                      checked={settings.hologramMode}
                      onCheckedChange={(checked) => saveSettings({ hologramMode: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Gameplay Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5" />
                    Gameplay Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Save</Label>
                      <p className="text-sm text-muted-foreground">Automatically save progress</p>
                    </div>
                    <Switch
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => saveSettings({ autoSave: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notifications</Label>
                      <p className="text-sm text-muted-foreground">Achievement alerts</p>
                    </div>
                    <Switch
                      checked={settings.notifications}
                      onCheckedChange={(checked) => saveSettings({ notifications: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Vibration</Label>
                      <p className="text-sm text-muted-foreground">Haptic feedback</p>
                    </div>
                    <Switch
                      checked={settings.vibration}
                      onCheckedChange={(checked) => saveSettings({ vibration: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Fast Mode</Label>
                      <p className="text-sm text-muted-foreground">Skip animations</p>
                    </div>
                    <Switch
                      checked={settings.fastMode}
                      onCheckedChange={(checked) => saveSettings({ fastMode: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Advanced Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Cache Enabled</Label>
                      <p className="text-sm text-muted-foreground">Store data locally</p>
                    </div>
                    <Switch
                      checked={settings.cacheEnabled}
                      onCheckedChange={(checked) => saveSettings({ cacheEnabled: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Offline Mode</Label>
                      <p className="text-sm text-muted-foreground">Use cached data only</p>
                    </div>
                    <Switch
                      checked={settings.offlineMode}
                      onCheckedChange={(checked) => saveSettings({ offlineMode: checked })}
                    />
                  </div>
                  
                  {isAdmin && (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Debug Mode</Label>
                          <p className="text-sm text-muted-foreground">Show debug information</p>
                        </div>
                        <Switch
                          checked={settings.debugMode}
                          onCheckedChange={(checked) => saveSettings({ debugMode: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Experimental Features</Label>
                          <p className="text-sm text-muted-foreground">Beta features access</p>
                        </div>
                        <Switch
                          checked={settings.experimentalFeatures}
                          onCheckedChange={(checked) => saveSettings({ experimentalFeatures: checked })}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Accessibility */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>High Contrast</Label>
                      <p className="text-sm text-muted-foreground">Increase color contrast</p>
                    </div>
                    <Switch
                      checked={settings.highContrast}
                      onCheckedChange={(checked) => saveSettings({ highContrast: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations</p>
                    </div>
                    <Switch
                      checked={settings.reducedMotion}
                      onCheckedChange={(checked) => saveSettings({ reducedMotion: checked })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Slider
                      value={[settings.fontSize]}
                      onValueChange={([value]) => saveSettings({ fontSize: value })}
                      max={24}
                      min={12}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="themes" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {themes.map((theme) => {
                  if (theme.adminOnly && !isAdmin) return null;
                  
                  return (
                    <Card
                      key={theme.id}
                      className={`cursor-pointer transition-all ${
                        selectedTheme === theme.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleThemeChange(theme.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-white/20"
                            style={{ backgroundColor: theme.color }}
                          />
                          <div className="flex-1">
                            <h4 className="font-medium flex items-center gap-2">
                              {theme.name}
                              {theme.adminOnly && <Shield className="h-4 w-4 text-yellow-500" />}
                            </h4>
                            <p className="text-sm text-muted-foreground">{theme.description}</p>
                          </div>
                          {selectedTheme === theme.id && (
                            <Badge variant="default">Active</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Your Progress</h3>
                    <p className="text-muted-foreground">
                      {unlockedAchievements.length} of {achievements.length} achievements unlocked
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    <Trophy className="h-4 w-4 mr-2" />
                    {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <Card
                      key={achievement.id}
                      className={`${
                        achievement.unlocked 
                          ? 'bg-primary/10 border-primary/20' 
                          : 'bg-muted/20 border-muted opacity-60'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-medium">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                            {achievement.unlocked && achievement.unlockedAt && (
                              <p className="text-xs text-primary mt-1">
                                Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                            {achievement.unlocked ? "Unlocked" : "Locked"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </motion.div>
  );
};