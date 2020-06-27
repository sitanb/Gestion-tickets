<template>
  <div>
    <welcome />
    <recent-projects />
    <services />
  </div>
</template>

<script>
export default {
  name: "CoreView",

  components: {
    RecentProjects: () => import("@/components/RecentProjects"),
    Services: () => import("@/components/Services"),
    Welcome: () => import("@/components/Welcome")
  }
};
</script>
