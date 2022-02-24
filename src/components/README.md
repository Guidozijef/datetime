#### install
```
yarn add luxon
```
Or
```
npm install --save luxon
```
#### Usage

```
<datetime v-model="date"></datetime>

```
#### Options

```
// type: date, time, datetime
<datetime v-model="date" :type="'datetime'"></datetime>

```

```
// week-start: 0, 1, 2, 3, 4, 5, 6, 7   default: 0,  First day of the week. 1 is Monday and 7 is Sunday.
<datetime v-model="date" :type="'datetime'" :weekStart="'0'"></datetime>

```

```
// change 事件
<datetime v-model="date" :type="'datetime'" @change="change"></datetime>

```

```
// format
<datetime v-model="date" :type="'datetime'" :format="yyy-MM-dd HH:mm:ss"></datetime>

```

```
// use12-hour 是否启用24小时制
<datetime v-model="date" :type="'datetime'" :use12-hour="true"></datetime>

```
```
// inputClass 输入框样式
<datetime v-model="date" :type="'datetime'" :inputClass="'input-class'"></datetime>

```

```
// disabled 是否禁用
<datetime v-model="date" :type="'datetime'" :disabled="true"></datetime>

```

```
// clearable 是否清空
<datetime v-model="date" :type="'datetime'" :clearable="true"></datetime>

```

```
// placeholder 请选择时间
<datetime v-model="date" :type="'datetime'" :placeholder="'请选择时间'"></datetime>

```