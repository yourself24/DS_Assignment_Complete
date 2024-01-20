package Services;
import Models.User;

import Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository UserRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.UserRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public Iterable<User> findAll(){
        return UserRepository.findAll();
    }
    public boolean registerUser(User user){
        String givenPassword = user.getPassword();
        String encryptedPassword = passwordEncoder.encode(givenPassword);
        user.setPassword(encryptedPassword);
        UserRepository.save(user);
        return true;
    }

    public boolean loginUser(String email, String password){
        User user = UserRepository.findByEmail(email);
        if(user == null){
            return false;
        }
        String encryptedPassword = user.getPassword();
        return passwordEncoder.matches(password, encryptedPassword);
    }
    public User findByEmail(String email){
        return UserRepository.findByEmail(email);
    }
    public User findById(Long id){
        return UserRepository.findById(id).orElse(null);
    }
    public User updateUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return UserRepository.save(user);
    }
    public void deleteUser(Long id){
        UserRepository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return UserRepository.findByEmail(email);
    }
}
