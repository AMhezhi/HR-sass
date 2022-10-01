<template>
  <div v-loading="loading" class="departments-container">
    <div class="app-container">
      <!-- 组织架构内容,头部 -->
      <el-card class="tree-card">
        <!-- 放置结构的内容 -->
        <TreeTools
          :tree-node="company"
          :is-root="true"
          @addDepts="addDepts"
        />
        <el-tree :data="departs" :props="defaultProps">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <TreeTools
            slot-scope="{data}"
            :tree-node="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
      <!-- 添加部门弹出层 -->
      <!-- // 父组件sync修饰符 -->
      <AddDept
        ref="addDepts"
        :show-dialog.sync="showDialog"
        :tree-node="node"
        @addDepts="getDepartments"
      />
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept' // 引入新增部门组件
import { getDepartments } from '@/api/departments'
import { tranListToTreeDate } from '@/utils/index'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' }, // 就是头部的数据
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      showDialog: false, // 显示窗体
      node: null, // 记录当前点击的部门
      loading: false // 用来控制进度弹层的显示和隐藏
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }// 这里定义一个空串  因为 它是根 所有的子节点的数据pid 都是 ""
      this.departs = tranListToTreeDate(result.depts, '')
      // console.log(result)
      this.loading = false
    },
    // 监听tree-tools中触发的点击添加子部门事件
    addDepts(node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
    },
    // 监听tree-tools中触发的点击编辑子部门事件
    editDepts(node) {
      this.showDialog = true // 显示弹层
      this.node = node // 赋值操作的节点
      // 我们需要在这个位置 调用子组件的方法
      // 父组件 调用子组件的方法
      this.$refs.addDepts.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
    }
  }
}

</script>

<style  scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
