class Profile {
    constructor(){
      this.status = false;
      this.role = -1;
    }
    // STATUS
    getStatus() {
        return this.status;
    }
    setStatus(v) {
        this.status = v;
    }
     // ROLE
     getRole() {
        return this.role;
    }
    setRole(v) {
        this.role = v;
    }
}

export const userData = new Profile();