package Controllers;


import Models.LoginRequest;
import Models.Role;
import Models.UpdateUser;
import Models.User;
import Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService UserService;

    @Autowired
    public UserController(Services.UserService userService) {
        UserService = userService;
    }

    @GetMapping("/details")
    public ResponseEntity<User> getUserDetails(){
        Authentication  authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = UserService.findByEmail(email);
        return ResponseEntity.ok(user);
    }
    @GetMapping("/all")
    public ResponseEntity<Iterable<User>> getAllUsers(){
        Iterable<User> users = UserService.findAll();
        return ResponseEntity.ok(users);
    }
    //get request to find a user by their id
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id){
        System.out.println("id: " + id);
        User user = UserService.findById(id);
        System.out.println("user: " + user.getName());
        return ResponseEntity.ok(user);
    }
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UpdateUser user){
        String email = user.getEmail();
        if(UserService.findByEmail(email) != null){
            return ResponseEntity.badRequest().body(null);
        }
        Role role;
        if(user.getAdmin()){
            role=Role.ADMIN;
        }
        else{
            role=Role.USER;
        }
        User userins = new User(user.getName(), user.getEmail(), user.getPassword(), user.getAdmin(),role);


        if(UserService.registerUser(userins)) {
            return ResponseEntity.ok(userins);
        }
        return ResponseEntity.badRequest().body(null);
        }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user){
        String email = user.getEmail();
        String password = user.getPassword();
        if(UserService.loginUser(email, password)){
            return ResponseEntity.ok("User logged in successfully");
        }
        return ResponseEntity.badRequest().body("Invalid credentials");
    }
    @PostMapping("/login2")
    public ResponseEntity<User> loginUser(@RequestBody LoginRequest loginRequest) {
        if(UserService.loginUser(loginRequest.getEmail(), loginRequest.getPassword())) {
            User user = UserService.findByEmail(loginRequest.getEmail());
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
    @PutMapping("/update")
    public ResponseEntity<User> updateUser(@RequestBody UpdateUser user){
        System.out.println("user: " + user.getName()+ " " + user.getEmail()+ " " + user.getPassword()+ " " + user.getId()+ " " + user.getAdmin());
        User userdb = UserService.findById(user.getId());
        userdb.setPassword(user.getPassword());
        userdb.setEmail(user.getEmail());
        userdb.setName(user.getName());
        userdb.setAdmin(user.getAdmin());
        UserService.updateUser(userdb);
        return ResponseEntity.ok(userdb);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id){
        User user = UserService.findById(id);
        if(user == null){
            return ResponseEntity.badRequest().body("User does not exist");
        }
        UserService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
    

}

