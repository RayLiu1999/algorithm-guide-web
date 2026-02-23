// Flashcard 記憶模式頁
import { useParams } from 'react-router-dom';

const FlashcardPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  return (
    <div>
      <h1>Flashcard 模式: {categoryId}</h1>
    </div>
  );
};

export default FlashcardPage;
