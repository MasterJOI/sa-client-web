export class ComponentInformationRequestBody {
  componentName: string;
  componentType: number;
  specialEquipmentInfo: string;
  file?: File;


  constructor(componentName: string, componentType: number, specialEquipmentInfo: string, file: File) {
    this.componentName = componentName;
    this.componentType = componentType;
    this.specialEquipmentInfo = specialEquipmentInfo;
    this.file = file;
  }
}
