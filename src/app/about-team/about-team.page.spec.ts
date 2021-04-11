import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AboutTeamPage } from './about-team.page';

describe('AboutTeamPage', () => {
  let component: AboutTeamPage;
  let fixture: ComponentFixture<AboutTeamPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutTeamPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutTeamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
