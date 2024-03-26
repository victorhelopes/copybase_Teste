<template>
  <main>
    <div class="input">
      <div>
        <p>Importe o arquivo .csv para fazer o cálculo das metricas</p>
        <input type="file" @change="handleFileUpload" ref="file"/>
      </div>
      <button @click="getMetrics">Carregar metricas</button>
    </div>
    <div v-if="showError">
      <p>input a file</p>
    </div>
    <div v-if="chartChurnData.labels.length > 0 || chartMRRData.labels.length > 0" class="charts">
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
        showError: false,
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
        },
      }
    },

  methods: {
    async getMetrics(){
      let formData = new FormData();
      formData.append('file', this.file);
      if(!this.file || this.file === '' ){
        this.showError = true;
        return;
      }else{
        this.showError = false
      }
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
      }).catch(()=>{
          this.showError = true;
        return;
        }
      )
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
    align-items: flex-start;
    flex-direction: column;
  }
  button{
    background-color: rgb(129, 131, 224);
    border: none;
    border-radius: 8px;
    padding: 10px;
    color: white;
    cursor: pointer;
    margin-top: 16px;
  }

  .charts{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 10px;
    div{
      width: 100%;
      max-width: 500px;
      canvas{
        width: 100%;
      }
    }
  }

@media (min-width: 1024px){
  .input{
    flex-direction: row;
    align-items: center;
  }

  button{
    margin-left: 80px;
  }
}
</style>