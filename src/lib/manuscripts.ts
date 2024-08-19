import * as Tweakpane from 'tweakpane';
import { World, type Entity } from '@medieval/sword';  // Assuming your ECS is defined in a 'world.ts' file

export class Manuscript<T extends Entity> {
  private pane: Tweakpane.Pane;
  private world: World<T>;
  private entitiesFolder: Tweakpane.FolderApi;
  private componentsFolder: Map<number, Tweakpane.FolderApi> = new Map();

  constructor(world: World<T>) {
    this.world = world;
    this.pane = new Tweakpane.Pane();
    this.entitiesFolder = this.pane.addFolder({ title: 'Entities' });

    // Adding Export Button
    this.pane.addButton({ title: 'Export' }).on('click', () => this.exportEntities());

    this.world.onEntityAddedHooks.push((entity) => this.addEntityToView(entity));
    this.world.onEntityRemovedHooks.push((entity) => this.removeEntityFromView(entity));

    this.update();
  }

  private addEntityToView(entity: T) {
    const entityFolder = this.entitiesFolder.addFolder({ title: `Entity ${entity.id}` });
    this.componentsFolder.set(entity.id, entityFolder);

    for (const [key, value] of Object.entries(entity)) {
      if (typeof value === 'object' && value !== null) {
        const subFolder = entityFolder.addFolder({ title: key });
        for (const [subKey, subValue] of Object.entries(value)) {
          subFolder.addBinding(entity[key], subKey, { step: 0.1 }).on('change', () => this.onComponentChange(entity));
        }
      } else {
        entityFolder.addBinding(entity, key).on('change', () => this.onComponentChange(entity));
      }
    }
  }

  private removeEntityFromView(entity: T) {
    const entityFolder = this.componentsFolder.get(entity.id);
    if (entityFolder) {
      entityFolder.dispose();
      this.componentsFolder.delete(entity.id);
    }
  }

  private onComponentChange(entity: T) {
   this.world.updateEntity(entity, entity)
  }

  private exportEntities() {
    const exportedCode = this.generateEntityCode();
    console.log(exportedCode);  // Output the code to the console
    this.downloadCodeFile(exportedCode); // Download the code as a file
  }

  private generateEntityCode(): string {
    let code = '';

    this.world.entities.forEach((entity) => {
      const components = JSON.stringify(entity, null, 2)
        .replace(/"([^"]+)":/g, '$1:') // Remove quotes from keys
        .replace(/"/g, "'"); // Replace double quotes with single quotes

      code += `world.createEntity(${components});\n`;
    });

    return code;
  }

  private downloadCodeFile(code: string) {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported_entities.ts';
    a.click();
    URL.revokeObjectURL(url);
  }

  private update() {
    requestAnimationFrame(() => this.update());
    this.pane.refresh();
  }
}


