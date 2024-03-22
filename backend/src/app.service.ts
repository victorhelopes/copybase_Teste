import { Injectable } from '@nestjs/common';
import { IResponse } from './interfaces/response';
import { getChurnRate } from './utils/getCancelData';

@Injectable()
export class AppService {
  getMetrics(lines: string[]): {
    MRR: IResponse[];
    Churn: IResponse[];
  } {
    const MRRAux: IResponse[] = [];
    const Churn: IResponse[] = [];

    lines.forEach((line) => {
      const lineInfos = line.split(',');
      const value = line.split('"')[1] || lineInfos[7];

      const startDate = lineInfos[2].split(' ')[0].split('/');
      let month = Number(startDate[0]);
      let year = Number(startDate[2]);

      if (Number(lineInfos[1]) > 30) {
        const monthlyValue = (parseFloat(value) / 12).toFixed(2);
        for (let i = 0; i < 12; i++) {
          const index = MRRAux.findIndex(
            (info) => info.label === month + '/' + year,
          );

          if (index === -1) {
            MRRAux.push({
              label: month + '/' + year,
              data: parseFloat(monthlyValue),
            });
          } else {
            MRRAux[index].data += parseFloat(value);
          }

          if (month >= 12) {
            month = 1;
            year += 1;
          } else {
            month += 1;
          }
        }
      } else {
        const index = MRRAux.findIndex(
          (info) => info.label === month + '/' + year,
        );
        if (index === -1) {
          MRRAux.push({
            label: month + '/' + year,
            data: parseFloat(value),
          });
        } else {
          MRRAux[index].data += parseFloat(value);
        }
      }

      if (lineInfos[3] === 'Cancelada') {
        const cancelDate = lineInfos[5].split(' ')[0].split('/');
        const exists = Churn.findIndex(
          (info) => info.label === cancelDate[0] + '/' + cancelDate[2],
        );
        if (exists === -1) {
          const churnRate = getChurnRate(lines, cancelDate);
          Churn.push({
            label: cancelDate[0] + '/' + cancelDate[2],
            data: churnRate,
          });
        }
      }
    });

    return { MRR: MRRAux, Churn };
  }
}
