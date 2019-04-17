<template lang="pug">
  div
    section.hero.is-info.is-bold
      .hero-body
        .container.has-text-centered
          h1.title Canvas Editor
    nuxt
    footer.footer
      .content.has-text-centered
        p &copy; {{ getYear() }} amiiby.com
</template>

<script>
export default {
  methods: {
    getYear() {
      let year = new Date().getFullYear()
      if (year > 2019) {
        year = '2019 - ' + year
      }
      return year
    }
  }
}
</script>
