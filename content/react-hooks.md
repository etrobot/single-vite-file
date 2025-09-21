---
title: "React Hooks使用指南"
date: "2025-01-18"
id: 4
category: "技术"
subcategory: "React"
---

# React Hooks使用指南

React Hooks是React 16.8引入的新特性，让我们能在函数组件中使用state和其他React特性。

## 常用Hooks

### useState
用于在函数组件中添加state：

```jsx
const [count, setCount] = useState(0)
```

### useEffect
用于处理副作用：

```jsx
useEffect(() => {
  document.title = `点击了 ${count} 次`
}, [count])
```

### useCallback
用于优化性能，避免不必要的重新渲染：

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b)
}, [a, b])
```

## 最佳实践

1. **合理使用依赖数组**
2. **避免在循环、条件或嵌套函数中调用Hook**
3. **使用自定义Hook复用逻辑**

Hooks让React函数组件变得更加强大和灵活！