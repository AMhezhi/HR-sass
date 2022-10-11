<template>
  <div class="employees-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <template v-slot:before>
          <span slot="before">共{{ page.total }}条记录</span>
        </template>

        <!-- 右侧显示按钮 -->
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import?type=user')">导入excel</el-button>
          <el-button size="small" type="danger" @click="exportData">导出excel</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </PageTools>

      <!-- 放置表格和分页 -->
      <el-card>
        <el-table v-loading="loading" border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" align="center">
            <template slot-scope="{row}">
              <img
                slot="reference"
                v-imageerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto "
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable prop="formOfEmployment" :formatter="formatEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template v-slot="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template v-slot="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            :current-page="page.page"
            :page-size="page.size"
            :total="page.total"
            layout="prev, pager, next"
            @current-change="changePage"
          />
        </el-row>
      </el-card>

      <!-- 放置新增组件 -->
      <addEmployess :show-dialog.sync="showDialog" />

      <el-dialog title="二维码" :visible.sync="showCodeDialog" @opened="showQrCode" @close="imgUrl=''">
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import addEmployess from './components/add-employess.vue'
// 在vue文件中引入,export导出的，你若要import必须加上{}; export default不需要
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
export default {
  components: {
    addEmployess
  },
  data() {
    return {
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      loading: false,
      showDialog: false, // 默认关闭弹层
      showCodeDialog: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      // console.log(rows)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    // newPage是最新页码
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 导出excel数据
    // 导出数据
    exportData() {
      // 懒加载模块 => 只有当点击按钮的时候才去加载这个模块
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        // 获取所有的员工列表数据
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        // rows是所有的员工列表数据
        const data = this.formatJSON(headers, rows)
        // [{ username: '张三', mobile: 123 }]  => [[ '张三', 123 ]]
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        // excel导出的默认对象
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx',
          multiHeader, // 复杂表头
          merges // 合并选项

        })
      })
    },
    // [{ username: '张三', mobile: 123 }]  => [[ '张三', 123 ]]
    // 数据的顺序是按照headers中key的顺序来的
    // 格式化json数据
    formatJSON(headers, rows) {
      // rows 是一行一行的  =>  [{},{}] => [[],[]]
      return rows.map(item => {
        // item {username: '张三', mobile: 123}  现在是对象 => []
        // ["姓名","手机号"] => [ '张三', '123']
        return Object.keys(headers).map(key => {
          // key是中文 headers[key]是英文 // item是 英文 {username: '张三', mobile: 123}
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 如果是日期的话 就需要格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 要把聘用形式转化成文本
            const obj = EmployeeEnum.hireType.find(o => o.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
    },
    showQrCode(url) {
      // url存在的情况下 才弹出层
      if (url) {
        this.showCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    }
  }
}
</script>

<style>

</style>
