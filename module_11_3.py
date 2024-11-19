def introspection_info(obj):
    obj_type = type(obj)
    attributes = [attr for attr in dir(obj) if not callable(getattr(obj, attr)) and not attr.startswith("__")]
    methods = [method for method in dir(obj) if callable(getattr(obj, method)) and not method.startswith("__")]
    module = getattr(obj, "__module__", "built-in")
    class_name = obj_type.__name__
    extra_info = {}
    if isinstance(obj, (int, float, str, list, dict, set, tuple)):
        extra_info["length"] = len(obj) if hasattr(obj, "__len__") else "N/A"
        extra_info["hashable"] = hasattr(obj, "__hash__")
    elif hasattr(obj, "__doc__"):
        extra_info["doc"] = obj.__doc__
    return {
        "type": class_name,
        "attributes": attributes,
        "methods": methods,
        "module": module,
        "extra_info": extra_info
    }

if __name__ == "__main__":
    number_info = introspection_info(42)
    print("Информация о числе:", number_info)
    
    string_info = introspection_info("Hello, World!")
    print("Информация о строке:", string_info)
    
    class CustomClass:
        """Пример пользовательского класса."""
        def __init__(self, value):
            self.value = value
        def display_value(self):
            return f"Value is {self.value}"
    
    custom_obj = CustomClass(10)
    custom_info = introspection_info(custom_obj)
    print("Информация о пользовательском классе:", custom_info)