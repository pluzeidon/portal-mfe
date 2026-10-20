import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortalContext } from './portal-context';

describe('PortalContext', () => {
  let component: PortalContext;
  let fixture: ComponentFixture<PortalContext>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalContext],
    }).compileComponents();

    fixture = TestBed.createComponent(PortalContext);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
