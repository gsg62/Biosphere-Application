import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManualCoordsPage } from './manual-coords.page';

describe('ManualCoordsPage', () => {
  let component: ManualCoordsPage;
  let fixture: ComponentFixture<ManualCoordsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualCoordsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManualCoordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
