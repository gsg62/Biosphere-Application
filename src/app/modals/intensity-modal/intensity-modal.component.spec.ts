import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IntensityModalComponent } from './intensity-modal.component';

describe('IntensityModalComponent', () => {
  let component: IntensityModalComponent;
  let fixture: ComponentFixture<IntensityModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntensityModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IntensityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
