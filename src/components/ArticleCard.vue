<template>
  <div class="article-card" @click="$emit('click')">
    <!-- 图片区域 -->
    <div v-if="article.image" class="article-card__image-wrapper">
      <img 
        :src="article.image" 
        :alt="article.title"
        loading="lazy"
        class="article-card__image"
        @error="handleImageError"
      />
      <div class="gradient-overlay"></div>
      
      <!-- 图片上的标题 -->
      <div class="image-title">
        <h3 class="image-title__text">{{ truncate(article.title, 60) }}</h3>
      </div>
    </div>

    <!-- 无图模式 -->
    <div v-else class="article-card__content">
      <h3 class="article-card__title">{{ truncate(article.title, 60) }}</h3>
      <p v-if="article.description" class="article-card__desc">
        {{ stripHtml(truncate(article.description, 120)) }}
      </p>
    </div>

    <!-- 底部信息 -->
    <div class="article-card__footer">
      <div class="article-card__meta">
        <van-icon name="clock-o" size="14" />
        <span>{{ formatDate(article.pubDate) }}</span>
      </div>
      <div v-if="article.author" class="article-card__author">
        <van-icon name="manager-o" size="14" />
        <span>{{ article.author }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDate, truncate, stripHtml } from '../utils/helpers'

defineProps({
  article: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

// 处理图片加载失败
function handleImageError(e) {
  e.target.style.display = 'none'
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';
@import '../styles/mixins.scss';

.article-card {
  @include poster-card;
  position: relative;
  background: $card-bg;
  
  &__image-wrapper {
    position: relative;
    width: 100%;
    padding-top: 56.25%; // 16:9 比例
    overflow: hidden;
  }
  
  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $transition-slow;
  }
  
  &:active &__image {
    transform: scale(1.05);
  }
  
  .gradient-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: $gradient-overlay;
  }
  
  .image-title {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: $spacing-md;
    z-index: 1;
    
    &__text {
      font-size: $font-size-md;
      font-weight: 600;
      color: $text-light;
      @include text-truncate(2);
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
  }
  
  &__content {
    padding: $spacing-md;
  }
  
  &__title {
    font-size: $font-size-md;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-xs;
    @include text-truncate(2);
  }
  
  &__desc {
    font-size: $font-size-sm;
    color: $text-secondary;
    line-height: $line-height-md;
    @include text-truncate(3);
  }
  
  &__footer {
    padding: $spacing-sm $spacing-md;
    border-top: 1px solid $border-light;
    @include flex-between;
    font-size: $font-size-xs;
    color: $text-muted;
  }
  
  &__meta,
  &__author {
    @include flex-vertical-center;
    gap: $spacing-xs;
  }
}
</style>
