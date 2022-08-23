<template lang="pug">
  q-item(clickable :href="link" :to="link")
    q-item-section(avatar style="width: 70px;")
      img(:style="'width: 100%; display: table; margin: 0 auto;' + css" :src="require(`../assets/${icon}`)")
    q-item-label {{ name }}
      q-item-label(caption) {{ caption }}
</template>

<script>
export default {
  name: "LeftMenuLink",
  props: {
    name: String,
    caption: String,
    icon: String,
    link: String,
    css: String
  }
}
</script>
