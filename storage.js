export class StorageManager {
  constructor() {
    this.PROJECT_KEY = "facelessforge_projects";
    this.EXPORT_KEY = "facelessforge_exports";
  }

  saveProject(project) {
    const projects = this.getProjects();
    projects.unshift({
      id: Date.now(),
      ...project
    });
    localStorage.setItem(
      this.PROJECT_KEY,
      JSON.stringify(projects)
    );
  }

  getProjects() {
    try {
      return JSON.parse(
        localStorage.getItem(this.PROJECT_KEY)
      ) || [];
    } catch {
      return [];
    }
  }

  getProject(id) {
    return this.getProjects().find(p => p.id === id);
  }

  deleteProject(id) {
    const projects = this.getProjects().filter(
      p => p.id !== id
    );

    localStorage.setItem(
      this.PROJECT_KEY,
      JSON.stringify(projects)
    );
  }

  saveExport(fileName) {
    const exports = this.getExports();

    exports.unshift({
      id: Date.now(),
      fileName,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem(
      this.EXPORT_KEY,
      JSON.stringify(exports)
    );
  }

  getExports() {
    try {
      return JSON.parse(
        localStorage.getItem(this.EXPORT_KEY)
      ) || [];
    } catch {
      return [];
    }
  }

  clearExports() {
    localStorage.removeItem(this.EXPORT_KEY);
  }

  clearAll() {
    localStorage.removeItem(this.PROJECT_KEY);
    localStorage.removeItem(this.EXPORT_KEY);
  }

  getStorageUsage() {
    let total = 0;

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length;
      }
    }

    return total;
  }
}

export class Utils {

  static downloadFile(blob, filename) {

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = filename;

    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(url);

  }

  static formatBytes(bytes) {

    if (bytes < 1024)
      return bytes + " B";

    if (bytes < 1024 * 1024)
      return (bytes / 1024).toFixed(2) + " KB";

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";

  }

  static randomSeed() {
    return Math.floor(
      Math.random() * 1000000
    );
  }

  static uuid() {
    return crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now()) +
          Math.random().toString(36).slice(2);
  }

  static wait(ms) {
    return new Promise(resolve =>
      setTimeout(resolve, ms)
    );
  }

}