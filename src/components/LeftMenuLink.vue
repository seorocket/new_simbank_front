<template lang="pug">
  q-item(clickable :href="link" :to="link")
    q-item-section(avatar)
      q-item-section(avatar style="padding: 0; display: flex; align-items: center;")
        q-icon(:name="icon" size="35px" style="color: #333;")
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
