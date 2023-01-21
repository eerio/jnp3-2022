docker exec -it ecbed01 sh -l
docker cp ecbed01a8919:/app/package-lock.json calendars/package-lock.json 


Aplikacja-niezapominajka do wysyłania powiadomień 
4 mikroserwisy:
- forgetmenot (public): frontend
  * łączy się z users. w celu autentyfikacji, autoryzacji i zarządzania
    sesjami uzytkowników
  * udostępnia zalogowanym użytkownikom dashboard podsumowujący
    ich nadchodzące wydarzenia
  * daje zalogowanym użytkownikom dostęp do części funkcjonalności
    serwisu calendars. (np. w celu dodania kalendarza)
- calendars.forgetmenot (private):
  * umożliwia zalogowanym użytkownikom dodawanie nowych kalendarzy
    i ustawianie na ile wcześniej mają być wysyłane powiadomienia
    dla danego kalendarza
- users.forgetmenot (private): 
  * autentyfikacja, autoryzacja, zarządzanie sesjami
- reminders.forgetmenot (private): 
  * wysyła użytkownikom powiadomienia o nadchodzących wydarzeniach

Serwis calendars:
przyjmuje id użytkownika i link do kalendarza
zbiera wszystkie wydarzenia w ciągu np. przyszłego tygodnia i dodaje je
do kolejki w reminders, uwzględniając na ile przed wydarzeniem ma być
wysłane powiadomienie
cyklicznie pobiera wydarzenia dla następnych tygodni i je dodaje
cyklicznie pobiera wydarzenia i sprawdza, czy żadne nie zostało przypadkiem
anulowane spośród tych już dodanych

Serwis reminders:
utrzymuje kolejkę (może buckety dla danej minuty? żeby móc usuwać eventy)
nadchodzących wydarzeń dla pewnej puli użytkowników (skalowalność
horyzontalna - trzymamy wiele kolejek i wiele workerów zajmuje się
generowaniem powiadomień) i wysyła powiadomienia, gdy zbliża się deadline.
umożliwia usuwanie eventów z kolejki, gdy te przestaną być aktualne
