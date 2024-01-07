
import { createApp } from 'vue';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/map';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/graphic';

const app = createApp();

app.config.globalProperties.$echarts = echarts;
app.mount('#middle-map');
