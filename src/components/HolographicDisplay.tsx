import { motion } from 'framer-motion';
import { Pokemon } from '@/types/pokemon';

interface HolographicDisplayProps {
  pokemon: Pokemon;
  className?: string;
}

export const HolographicDisplay = ({ pokemon, className = "" }: HolographicDisplayProps) => {
  const primaryType = pokemon.types[0]?.type.name || 'normal';
  
  return (
    <div className={`relative ${className}`}>
      {/* Holographic Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary/40"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 translate-y-1/2" />
        <div className="absolute left-0 top-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute right-0 top-1/2 w-2 h-2 bg-primary rounded-full transform translate-x-1/2 -translate-y-1/2" />
      </motion.div>
      
      {/* Glow Effect */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-radial from-type-${primaryType}/20 via-transparent to-transparent`}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Pokémon Sprite */}
      <motion.div
        className="relative z-10 flex items-center justify-center h-full"
        animate={{
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.1,
          rotateY: 15,
        }}
      >
        <img
          src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-full h-full object-contain drop-shadow-2xl"
          style={{
            filter: `drop-shadow(0 0 20px var(--type-${primaryType}))`,
          }}
        />
      </motion.div>
      
      {/* Scanning Lines */}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{
            y: [-20, 220],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </div>
  );
};