# react-scratchcard
react component scratchcard

# 使用方式
```javascript

<ScratchCard
  width = '750' // 遮罩层宽度
  height='280'  // 遮罩层高度
  radius = {20} // 触点半径
  fadeout = '1000'  // 消失延时
  percent={.5}  // 超过占比完全显示
  onFinish={()=>{ // 完成后的回调
    console.log('完成')
  }}
>你中奖了 
</ScratchCard>
```

需要显示的元素放入children中。