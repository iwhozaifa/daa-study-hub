import { loadFlashcards } from '@/lib/flashcards';
import { FlashcardDeck } from './flashcard-deck';

/** Server wrapper: reads the Anki CSV at build time, so a new row there is a new card here. */
export function FlashcardsFromCsv() {
  return <FlashcardDeck cards={loadFlashcards()} />;
}
