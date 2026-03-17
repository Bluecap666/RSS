<template>
  <div class="feed-card" @click="$emit('click')">
    <div class="feed-card__header">
      <div class="feed-card__info">
        <h3 class="feed-card__title">{{ feed.title }}</h3>
        <p v-if="feed.description" class="feed-card__desc">{{ truncate(feed.description, 50) }}</p>
        <p v-if="lastUpdate" class="feed-card__time">更新于 {{ lastUpdate }}</p>
      </div>
      <div class="feed-card__actions">
        <button @click.stop="$emit('refresh')" class="action-btn">
          <van-icon name="replay-o" size="20" />
        </button>
        <button @click.stop="$emit('edit')" class="action-btn">
          <van-icon name="edit-o" size="20" />
        </button>
        <button @click.stop="$emit('delete')" class="action-btn danger">
          <van-icon name="delete-o" size="20" />
        </button>
      </div>
    </div>
    
    <!-- 文章数量 -->
    <div v-if="feed.items && feed.items.length > 0" class="feed-card__footer">
      <van-icon name="underway-o" size="16" />
      <span>{{ feed.items.length }} 篇文章</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate, truncate } from '../utils/helpers'

const props = defineProps({
  feed: {
    type: Object,
    required: true
  }
})

defineEmits(['click', 'refresh', 'edit', 'delete'])

// 格式化最后更新时间
const lastUpdate = computed(() => {
  if (!props.feed.lastUpdate) return ''
  return formatDate(props.feed.lastUpdate)
})
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';
@import '../styles/mixins.scss';

.feed-card {
  @include poster-card;
  padding: $spacing-md;
  margin-bottom: $spacing-sm;
  
  &__header {
    @include flex-between;
    align-items: flex-start;
  }
  
  &__info {
    flex: 1;
    min-width: 0;
  }
  
  &__title {
    font-size: $font-size-md;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-xs;
    @include text-truncate(1);
  }
  
  &__desc {
    font-size: $font-size-xs;
    color: $text-secondary;
    margin-bottom: $spacing-xs;
    @include text-truncate(2);
  }
  
  &__time {
    font-size: $font-size-xs;
    color: $text-muted;
  }
  
  &__actions {
    display: flex;
    gap: $spacing-xs;
    margin-left: $spacing-sm;
  }
  
  &__footer {
    margin-top: $spacing-sm;
    padding-top: $spacing-sm;
    border-top: 1px solid $border-light;
    font-size: $font-size-xs;
    color: $text-secondary;
    @include flex-vertical-center;
    gap: $spacing-xs;
  }
}

.action-btn {
  padding: $spacing-xs;
  color: $text-secondary;
  border-radius: $radius-xs;
  transition: background $transition-fast;
  
  &:active {
    background: $bg-color;
  }
  
  &.danger {
    color: $error-color;
    
    &:active {
      background: rgba($error-color, 0.1);
    }
  }
}
</style>
