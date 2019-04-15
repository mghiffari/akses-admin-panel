import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTabGroup, MatTab, MatTabHeader } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-credit-simulation-product',
  templateUrl: './credit-simulation-product.component.html',
  styleUrls: ['./credit-simulation-product.component.scss']
})
export class CreditSimulationProductComponent implements OnInit {
  loading = false;
  components = [];
  data = [];
  productId;
  product;
  tenureMonths = [
    3, 6, 9, 12, 15, 18, 21, 24, 30, 36, 42, 48, 54, 60
  ]
  tableColumns = [];
  selectedIndex = 0;
  edit = false;
  locale = 'id';

  private table: any;
  @ViewChild('areaTenureTable') set tabl(table: ElementRef) {
    this.table = table;
  }

  private tabs: MatTabGroup;
  @ViewChild('tabs') set tabsEl(tabs: MatTabGroup) {
    this.tabs = tabs;
  }

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    console.log('CreditSimulationProductComponent | ngOnInit')
    this.route.params.subscribe(params => {
      try {
        console.table(params);
        this.productId = params.productId;
        this.translateService.get('angularLocale').subscribe(res => {
          this.locale = res;
        });
        this.edit = false;
        this.tabs._handleClick = this.interceptTabChange.bind(this)
        this.tableColumns = ['area']
        this.tenureMonths.forEach(month => {
          this.tableColumns.push('tnr' + month)
        })
        this.components = [
          {
            id: 'component0001',
            name: 'EFF Rate',
            format: 'percentage'
          },
          {
            id: 'component0002',
            name: 'Biaya Adm',
            format: 'nominal'
          },
          {
            id: 'component0003',
            name: 'Insurance TLO',
            format: 'percentage'
          },
          {
            id: 'component0004',
            name: 'Insurance All Risk',
            format: 'percentage'
          },
          {
            id: 'component0005',
            name: 'Biaya Provisi',
            format: 'nominal'
          }
        ]
        this.product = {
          name: 'New Car'
        }
        if(this.selectedIndex === 0){
          this.loadData()
        } else {
          this.selectedIndex = 0;
        }
      } catch (error) {
        console.table(error)
      }
    })
  }

  // method to intercept tab click event, to verify when editing
  interceptTabChange (tab: MatTab, tabHeader: MatTabHeader, idx: number) {
    console.log('CreditSimulationProductComponent | interceptTabChange');
    let result = false;
    if(this.edit){
      result = true;
      //show modal here
    } else {
      result = true;
    }

    return result && MatTabGroup.prototype._handleClick.apply(this.tabs, arguments);
  }

  // handle tabChange
  onChangeTabIndex(index){
    console.log('CreditSimulationProductComponent | onChangeTabIndex');
    this.selectedIndex = index;
    this.loadData();
  }

  //change to edit mode for component
  onEdit(component){
    console.log('CreditSimulationProductComponent | onEdit');
    this.edit = true;
  }

  // call api to load table data base on product id and component id
  loadData() {
    console.log('CreditSimulationProductComponent | loadData')
    this.loading = true;
    this.edit = false;
    let component = this.components[this.selectedIndex]
    if(component.format === 'percentage'){
      this.data = [
        {
          area: 'Jabotabek',
          tnr_3: 0.123456,
          tnr_6: 0.2,
          tnr_9: 0.3,
          tnr_12: 0.4,
          tnr_15: 0.5,
          tnr_18: 0.6,
          tnr_21: 0.7,
          tnr_24: 0.8,
          tnr_30: 0.9,
          tnr_36: 1.0,
          tnr_42: 1.1,
          tnr_48: 1.2,
          tnr_54: 1.3,
          tnr_60: 1.4,
        },
        {
          area: 'Jabar',
          tnr_3: 0.1,
          tnr_6: 0.2,
          tnr_9: 0.3,
          tnr_12: 0.4,
          tnr_15: 0.5,
          tnr_18: 0.6,
          tnr_21: 0.7,
          tnr_24: 0.8,
          tnr_30: 0.9,
          tnr_36: 1.0,
          tnr_42: 1.1,
          tnr_48: 1.2,
          tnr_54: 1.3,
          tnr_60: 1.4,
        },
        {
          area: 'Jatim',
          tnr_3: 0.1,
          tnr_6: 0.2,
          tnr_9: 0.3,
          tnr_12: 0.4,
          tnr_15: 0.5,
          tnr_18: 0.6,
          tnr_21: 0.7,
          tnr_24: 0.8,
          tnr_30: 0.9,
          tnr_36: 1.0,
          tnr_42: 1.1,
          tnr_48: 1.2,
          tnr_54: 1.3,
          tnr_60: 1.4,
        },
        {
          area: 'Jateng',
          tnr_3: 0.1,
          tnr_6: 0.2,
          tnr_9: 0.3,
          tnr_12: 0.4,
          tnr_15: 0.5,
          tnr_18: 0.6,
          tnr_21: 0.7,
          tnr_24: 0.8,
          tnr_30: 0.9,
          tnr_36: 1.0,
          tnr_42: 1.1,
          tnr_48: 1.2,
          tnr_54: 1.3,
          tnr_60: 1.4,
        },
        {
          area: 'Kalimantan',
          tnr_3: 0.1,
          tnr_6: 0.2,
          tnr_9: 0.3,
          tnr_12: 0.4,
          tnr_15: 0.5,
          tnr_18: 0.6,
          tnr_21: 0.7,
          tnr_24: 0.8,
          tnr_30: 0.9,
          tnr_36: 1.0,
          tnr_42: 1.1,
          tnr_48: 1.2,
          tnr_54: 1.3,
          tnr_60: 1.4,
        },
        {
          area: 'Sulawesi, Maluku, Papua',
          tnr_3: 0.1,
          tnr_6: 0.2,
          tnr_9: 0.3,
          tnr_12: 0.4,
          tnr_15: 0.5,
          tnr_18: 0.6,
          tnr_21: 0.7,
          tnr_24: 0.8,
          tnr_30: 0.9,
          tnr_36: 1.0,
          tnr_42: 1.1,
          tnr_48: 1.2,
          tnr_54: 1.3,
          tnr_60: 1.4,
        },
        {
          area: 'Bali & Nusa Tenggara',
          tnr_3: 0.1,
          tnr_6: 0.2,
          tnr_9: 0.3,
          tnr_12: 0.4,
          tnr_15: 0.5,
          tnr_18: 0.6,
          tnr_21: 0.7,
          tnr_24: 0.8,
          tnr_30: 0.9,
          tnr_36: 1.0,
          tnr_42: 1.1,
          tnr_48: 1.2,
          tnr_54: 1.3,
          tnr_60: 1.4,
        },
        {
          area: 'Sumbagut',
          tnr_3: 0.1,
          tnr_6: 0.2,
          tnr_9: 0.3,
          tnr_12: 0.4,
          tnr_15: 0.5,
          tnr_18: 0.6,
          tnr_21: 0.7,
          tnr_24: 0.8,
          tnr_30: 0.9,
          tnr_36: 1.0,
          tnr_42: 1.1,
          tnr_48: 1.2,
          tnr_54: 1.3,
          tnr_60: 1.4,
        },
        {
          area: 'Sumbagsel',
          tnr_3: 0.1,
          tnr_6: 0.2,
          tnr_9: 0.3,
          tnr_12: 0.4,
          tnr_15: 0.5,
          tnr_18: 0.6,
          tnr_21: 0.7,
          tnr_24: 0.8,
          tnr_30: 0.9,
          tnr_36: 1.0,
          tnr_42: 1.1,
          tnr_48: 1.2,
          tnr_54: 1.3,
          tnr_60: 1.4,
        }
      ]  
    } else {
      this.data = [
        {
          area: 'Jabotabek',
          tnr_3: 100000,
          tnr_6: 200000,
          tnr_9: 300000,
          tnr_12: 400000,
          tnr_15: 500000,
          tnr_18: 600000,
          tnr_21: 700000,
          tnr_24: 800000,
          tnr_30: 900000,
          tnr_36: 1000000,
          tnr_42: 1100000,
          tnr_48: 1200000,
          tnr_54: 1300000,
          tnr_60: 1400000,
        },
        {
          area: 'Jabar',
          tnr_3: 100000,
          tnr_6: 200000,
          tnr_9: 300000,
          tnr_12: 400000,
          tnr_15: 500000,
          tnr_18: 600000,
          tnr_21: 700000,
          tnr_24: 800000,
          tnr_30: 900000,
          tnr_36: 1000000,
          tnr_42: 1100000,
          tnr_48: 1200000,
          tnr_54: 1300000,
          tnr_60: 1400000,
        },
        {
          area: 'Jatim',
          tnr_3: 100000,
          tnr_6: 200000,
          tnr_9: 300000,
          tnr_12: 400000,
          tnr_15: 500000,
          tnr_18: 600000,
          tnr_21: 700000,
          tnr_24: 800000,
          tnr_30: 900000,
          tnr_36: 1000000,
          tnr_42: 1100000,
          tnr_48: 1200000,
          tnr_54: 1300000,
          tnr_60: 1400000,
        },
        {
          area: 'Jateng',
          tnr_3: 100000,
          tnr_6: 200000,
          tnr_9: 300000,
          tnr_12: 400000,
          tnr_15: 500000,
          tnr_18: 600000,
          tnr_21: 700000,
          tnr_24: 800000,
          tnr_30: 900000,
          tnr_36: 1000000,
          tnr_42: 1100000,
          tnr_48: 1200000,
          tnr_54: 1300000,
          tnr_60: 1400000,
        },
        {
          area: 'Kalimantan',
          tnr_3: 100000,
          tnr_6: 200000,
          tnr_9: 300000,
          tnr_12: 400000,
          tnr_15: 500000,
          tnr_18: 600000,
          tnr_21: 700000,
          tnr_24: 800000,
          tnr_30: 900000,
          tnr_36: 1000000,
          tnr_42: 1100000,
          tnr_48: 1200000,
          tnr_54: 1300000,
          tnr_60: 1400000,
        },
        {
          area: 'Sulawesi, Maluku, Papua',
          tnr_3: 100000,
          tnr_6: 200000,
          tnr_9: 300000,
          tnr_12: 400000,
          tnr_15: 500000,
          tnr_18: 600000,
          tnr_21: 700000,
          tnr_24: 800000,
          tnr_30: 900000,
          tnr_36: 1000000,
          tnr_42: 1100000,
          tnr_48: 1200000,
          tnr_54: 1300000,
          tnr_60: 1400000,
        },
        {
          area: 'Bali & Nusa Tenggara',
          tnr_3: 100000,
          tnr_6: 200000,
          tnr_9: 300000,
          tnr_12: 400000,
          tnr_15: 500000,
          tnr_18: 600000,
          tnr_21: 700000,
          tnr_24: 800000,
          tnr_30: 900000,
          tnr_36: 1000000,
          tnr_42: 1100000,
          tnr_48: 1200000,
          tnr_54: 1300000,
          tnr_60: 1400000,
        },
        {
          area: 'Sumbagut',
          tnr_3: 100000,
          tnr_6: 200000,
          tnr_9: 300000,
          tnr_12: 400000,
          tnr_15: 500000,
          tnr_18: 600000,
          tnr_21: 700000,
          tnr_24: 800000,
          tnr_30: 900000,
          tnr_36: 1000000,
          tnr_42: 1100000,
          tnr_48: 1200000,
          tnr_54: 1300000,
          tnr_60: 1400000,
        },
        {
          area: 'Sumbagsel',
          tnr_3: 100000,
          tnr_6: 200000,
          tnr_9: 300000,
          tnr_12: 400000,
          tnr_15: 500000,
          tnr_18: 600000,
          tnr_21: 700000,
          tnr_24: 800000,
          tnr_30: 900000,
          tnr_36: 1000000,
          tnr_42: 1100000,
          tnr_48: 1200000,
          tnr_54: 1300000,
          tnr_60: 1400000,
        }
      ]
      
    }
    if (this.table) {
      this.table.renderRows();
    }
    this.loading = false;
  }
}
