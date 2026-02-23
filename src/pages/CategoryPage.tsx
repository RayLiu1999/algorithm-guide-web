// 分類閱讀頁 - 顯示特定分類的所有題目教學
import { useParams } from 'react-router-dom';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  return (
    <div>
      <h1>分類: {categoryId}</h1>
    </div>
  );
};

export default CategoryPage;
