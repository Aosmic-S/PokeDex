import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAchievementStore } from '@/stores/achievementStore';
import { useTeamStore } from '@/stores/teamStore';
import { 
  Database, 
  Trash2, 
  Settings, 
  Trophy, 
  Users, 
  BarChart3,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [hologramMode, setHologramMode] = useState(true);
  const [achievementsEnabled, setAchievementsEnabled] = useState(true);
  const [cacheSize, setCacheSize] = useState('0 MB');
  
  const { achievements, stats } = useAchievementStore();
  const { teams } = useTeamStore();
  
  const correctPassword = 'AURA@DEX'; // Updated password
  
  useEffect(() => {
    // Calculate cache size (rough estimation)
    const totalData = localStorage.length + (teams.length * 1000);
    setCacheSize(`${(totalData / 1024).toFixed(2)} KB`);
  }, [teams]);
  
  const handleLogin = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('admin-auth', 'true');
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin-auth');
    setPassword('');
  };
  
  const clearCache = () => {
    localStorage.clear();
    window.location.reload();
  };
  
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const mostViewedStat = Math.max(...Object.values(stats));
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="p-6">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Admin Access</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter the admin password to continue
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter admin password"
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Access Admin Panel
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PokédexX Admin Panel
            </h1>
            <p className="text-muted-foreground">© 2025 Made by Hynx Studios</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <EyeOff className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pokémon Cached</p>
                  <p className="text-2xl font-bold">{stats.pokemonViewed}</p>
                </div>
                <Database className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Teams Built</p>
                  <p className="text-2xl font-bold">{teams.length}</p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                  <p className="text-2xl font-bold">{unlockedAchievements.length}/{achievements.length}</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cache Size</p>
                  <p className="text-2xl font-bold">{cacheSize}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                App Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="hologram">Hologram Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable 3D holographic Pokémon display
                  </p>
                </div>
                <Switch
                  id="hologram"
                  checked={hologramMode}
                  onCheckedChange={setHologramMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="achievements">Achievements</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable achievement system
                  </p>
                </div>
                <Switch
                  id="achievements"
                  checked={achievementsEnabled}
                  onCheckedChange={setAchievementsEnabled}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm mb-2">
                  <strong>Total Cache:</strong> {cacheSize}
                </p>
                <p className="text-sm mb-2">
                  <strong>Teams:</strong> {teams.length} saved
                </p>
                <p className="text-sm">
                  <strong>Achievements:</strong> {unlockedAchievements.length} unlocked
                </p>
              </div>
              
              <Button 
                variant="destructive" 
                onClick={clearCache}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Cache
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Achievement Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Achievement Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border ${
                    achievement.unlocked 
                      ? 'bg-primary/10 border-primary/20' 
                      : 'bg-muted/20 border-muted'
                  }`}
                >
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Admin;