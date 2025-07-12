import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/stores/achievementStore';
import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementNotification = ({ achievement, onClose }: AchievementNotificationProps) => {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="fixed top-4 right-4 z-50"
        >
          <Card className="p-4 bg-gradient-to-r from-primary/20 to-accent/20 border-primary/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-primary">Achievement Unlocked!</h3>
                <p className="text-sm text-muted-foreground">{achievement.title}</p>
                <p className="text-xs text-muted-foreground/80">{achievement.description}</p>
              </div>
              <div className="text-2xl">{achievement.icon}</div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};