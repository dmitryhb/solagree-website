<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug || '').trim()

await navigateTo({
  path: `/go/${encodeURIComponent(slug)}/embed`,
  query: route.query,
  hash: route.hash
}, {
  redirectCode: 301
})
</script>
