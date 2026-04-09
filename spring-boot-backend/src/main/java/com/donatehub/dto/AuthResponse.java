package com.donatehub.dto;

public class AuthResponse {

    private boolean success;
    private String message;
    private String token;
    private UserDto user;

    public AuthResponse() {
    }

    public AuthResponse(boolean success, String message, String token, UserDto user) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.user = user;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
        private boolean success;
        private String message;
        private String token;
        private UserDto user;

        public AuthResponseBuilder success(boolean success) {
            this.success = success;
            return this;
        }

        public AuthResponseBuilder message(String message) {
            this.message = message;
            return this;
        }

        public AuthResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public AuthResponseBuilder user(UserDto user) {
            this.user = user;
            return this;
        }

        public AuthResponse build() {
            return new AuthResponse(success, message, token, user);
        }
    }

    public static class UserDto {
        private String id;
        private String fullName;
        private String email;
        private String role;
        private String avatar;

        public UserDto() {
        }

        public UserDto(String id, String fullName, String email, String role, String avatar) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.role = role;
            this.avatar = avatar;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getAvatar() {
            return avatar;
        }

        public void setAvatar(String avatar) {
            this.avatar = avatar;
        }

        public static UserDtoBuilder builder() {
            return new UserDtoBuilder();
        }

        public static class UserDtoBuilder {
            private String id;
            private String fullName;
            private String email;
            private String role;
            private String avatar;

            public UserDtoBuilder id(String id) {
                this.id = id;
                return this;
            }

            public UserDtoBuilder fullName(String fullName) {
                this.fullName = fullName;
                return this;
            }

            public UserDtoBuilder email(String email) {
                this.email = email;
                return this;
            }

            public UserDtoBuilder role(String role) {
                this.role = role;
                return this;
            }

            public UserDtoBuilder avatar(String avatar) {
                this.avatar = avatar;
                return this;
            }

            public UserDto build() {
                return new UserDto(id, fullName, email, role, avatar);
            }
        }
    }
}
