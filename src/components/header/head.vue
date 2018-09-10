
<template>
  <header>
    <section class="logoPart">
      Friend
    </section>
  </header>
</template>

<script>

  export default{
    data(){
      return{
        addthing:false,

      }
    },
    created(){

    },
    mounted(){

    },
    components:{

    },
    computed:{

    },
    methods:{
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../style/public";
  header{
    @include widthHeight(100%,2.06933rem);
    background:$black;
    z-index:200;
    color:#fff;
    position: fixed;
    .logoPart{
      @include topcenter;
      width: 100%;
      @include sizeColor(0.704rem,#fff);
      @include justify(center);
      align-items:center;
    }
  }
</style>
