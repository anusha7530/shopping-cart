import { useState } from "react";
import { useQuery } from "react-query";
import Item from "./Item/Item";
import Cart from "./Cart/Cart";
import { Drawer, LinearProgress, Grid, Badge } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Wrapper, StyledButton } from "./App.styles";

export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  quantity: number;
};

const getProducts = async (): Promise<CartItemType[]> =>{
  return await (await fetch("https://fakestoreapi.com/products")).json();
}
  

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "products",
    getProducts
  );
  console.log(data);

  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((ack: number, item) => ack + item.quantity, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      const isItemInCart = prev.find(item => item.id === clickedItem.id)

      if(isItemInCart){
        return prev.map( item => 
          item.id === clickedItem.id ? {...item, quantity: item.quantity+1 } : item
        );
      }
      return [...prev,{...clickedItem, quantity : 1}]
    })
  }

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => 
      prev.reduce((ack,item) => {
        if(item.id === id){
          if(item.quantity === 1) return ack;
          return [...ack, {...item, quantity: item.quantity - 1}]
        }else{
          return [...ack,item];
        }
      },[] as CartItemType[])
    );
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong</div>;

  return (
    <Wrapper>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCartIcon fontSize="large"/>
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default App;
