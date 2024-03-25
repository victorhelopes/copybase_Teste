<template>
  <main>
    <div class="input">
      <input type="file" @change="handleFileUpload" ref="file"/>
      <button @click="getMetrics">Carregar metricas</button>
    </div>
    <div class="charts">
      <div>
        <h3>Churn</h3>
        <Bar
        id="churn"
        :options="chartOptions"
        :data="{
          labels: chartChurnData.labels,
          datasets: [{data: chartChurnData.datasets[0].data}]
        }"
      />
      </div>
      <div>
        <h3>MRR</h3>
        <Bar
        id="MRR"
        :options="chartOptions"
        :data="{
          labels: chartMRRData.labels,
          datasets: [{data: chartMRRData.datasets[0].data}]
        }"
      />
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import {Bar} from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

import {api} from '../services/api'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface IResponse  {label: string; data: number}

export default{
  components: { Bar },
  
  data() {
      return {
        file: '',
        chartChurnData: {
          labels: [] as string[],
          datasets: [ { data: [] as number[] } ]
        },
        chartMRRData: {
          labels: [] as string[],
          datasets: [ { data: [] as number[] } ]
        },
        chartOptions: {
          responsive: true
        }
      }
    },

  methods: {
    async getMetrics(){
      let formData = new FormData();
      formData.append('file', this.file);
      const mrr: number[] = []
      const churn: number[] = []
      this.chartChurnData.labels = []
      this.chartMRRData.labels = []
      await api.post('', formData).then((res)=>{
        res.data.Churn.map((churnInfo: IResponse)=>{
          this.chartChurnData.labels.push(churnInfo.label)
          churn.push(churnInfo.data)
        })

        res.data.MRR.map((mrrInfo: IResponse)=>{
          if(mrrInfo.label){
            this.chartMRRData.labels.push(mrrInfo.label)
            mrr.push(mrrInfo.data)
          }
        })
      })
        this.chartChurnData.datasets[0].data = churn
        this.chartMRRData.datasets[0].data = mrr
    },

    handleFileUpload(){
      this.file = (this.$refs.file as any).files[0]
    }
  }
  }
</script>

<style scoped>
  .input{
    display: flex;
    align-items: center;
    button{
      margin-left: 80px;
      background-color: rgb(129, 131, 224);
      border: none;
      border-radius: 8px;
      padding: 10px;
      color: white;
      cursor: pointer;
    }
  }

  .charts{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    div{
      width: 100%;
      canvas{
        width: 100%;
        max-width: 500px;
      }
    }
  }
</style>