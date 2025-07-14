<script>
import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";
import ProductItem from "@/components/ProductItem.vue";
import CartSidebar from "@/components/CartSidebar.vue";
import WishlistSidebar from "@/components/WishlistSidebar.vue";

export default {
  components: {
    Header,
    Footer,
    ProductItem,
    CartSidebar,
    WishlistSidebar
  }
};
</script>

<template>
  <div>
    <Header />
    <ProductItem />
    <CartSidebar />
    <WishlistSidebar />
    <Footer />
  </div>
</template>
