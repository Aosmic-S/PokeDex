import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onTypeFilter: (type: string) => void;
  selectedType: string;
}

const pokemonTypes = [
  'all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export const SearchBar = ({ onSearch, onTypeFilter, selectedType }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="glass rounded-xl p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search Pokémon by name..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all duration-300"
          />
        </div>

        {/* Type Filter */}
        <div className="flex gap-2">
          <Select value={selectedType} onValueChange={onTypeFilter}>
            <SelectTrigger className="w-40 bg-background/50 border-border/50">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {pokemonTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  <span className="capitalize">{type === 'all' ? 'All Types' : type}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};