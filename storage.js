export class StorageManager {

    constructor() {
        this.KEY = "facelessforge_projects";
    }

    getProjects() {
        return JSON.parse(localStorage.getItem(this.KEY)) || [];
    }

    saveProject(project) {

        const projects = this.getProjects();

        project.id = project.id || Date.now();

        const index = projects.findIndex(p => p.id === project.id);

        if (index >= 0)
            projects[index] = project;
        else
            projects.unshift(project);

        localStorage.setItem(
            this.KEY,
            JSON.stringify(projects)
        );
    }

    deleteProject(id) {

        const projects = this.getProjects()
            .filter(p => p.id !== id);

        localStorage.setItem(
            this.KEY,
            JSON.stringify(projects)
        );
    }

    loadProject(id) {

        return this.getProjects()
            .find(p => p.id === id);

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
