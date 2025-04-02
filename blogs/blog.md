# 测试
这是一个测试
```haskell
newtype MyList a = MyList [a] deriving (Show)

instance Semigroup (MyList a) where
  (<>) :: MyList a -> MyList a -> MyList a
  (<>) (MyList xs) (MyList ys) = MyList (xs ++ ys)

instance Monoid (MyList a) where
  mempty :: MyList a
  mempty = MyList []
  mappend :: MyList a -> MyList a -> MyList a
  mappend = (<>)
  mconcat :: [MyList a] -> MyList a
  mconcat [] = MyList []
  mconcat (x : xs) = mappend x (mconcat xs)
```