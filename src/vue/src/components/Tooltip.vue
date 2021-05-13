<template>
  <div class="tooltip">
    <div class="arrow"></div>
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'Tooltip',
  components: {},
  props: {
    text: String
  },
  data: function () {
    return {}
  },
  mounted: function () {},
  methods: {
  }
}
</script>

<style scoped lang="scss">
  @import '../styles/variables';

  .tooltip {
    position: absolute;
    width: 115px;
    background: var(--bg-color-2);
    color: var(--text-color-1);
    border-radius: 4px;
    padding: 6px;
    padding-left: 8px;
    font-weight: 600;
    font-size: 13px;
    margin-left: 54px;

    .arrow {
      position: absolute;
      width: 10px;
      height: 10px;
      border-bottom-left-radius: 3px;
      background: var(--bg-color-2);
      top: 15px;
      left: -5px;
      transform: rotate(45deg);
    }
  }
</style>
